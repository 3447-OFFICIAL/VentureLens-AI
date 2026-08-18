import hashlib
import logging
from typing import Any, Dict, List, Optional

from openai import AsyncOpenAI
from qdrant_client import QdrantClient
from qdrant_client.http import models as qmodels

from .config import settings

logger = logging.getLogger(__name__)

COLLECTION_NAME = "documents"
VECTOR_DIMENSION = 1536

_in_memory_docs: List[Dict[str, Any]] = []

def get_qdrant_client() -> Optional[QdrantClient]:
    """
    Returns a configured Qdrant Client, or None if connection fails.
    """
    try:
        host = settings.QDRANT_HOST if settings.QDRANT_HOST.startswith("http") else f"http://{settings.QDRANT_HOST}:6333"
        client = QdrantClient(url=host, timeout=3.0)
        return client
    except Exception as e:
        logger.warning(f"Qdrant connection unavailable, falling back to local vector memory: {e}")
        return None

def init_qdrant_collections():
    """
    Initialize Qdrant collections if they don't exist.
    """
    client = get_qdrant_client()
    if not client:
        return
    try:
        collections = [col.name for col in client.get_collections().collections]
        if COLLECTION_NAME not in collections:
            client.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=qmodels.VectorParams(
                    size=VECTOR_DIMENSION,
                    distance=qmodels.Distance.COSINE
                )
            )
            logger.info(f"Created Qdrant collection: {COLLECTION_NAME}")
    except Exception as e:
        logger.warning(f"Could not initialize Qdrant collection: {e}")

async def generate_embedding(text: str) -> List[float]:
    """
    Generates a 1536-dimensional vector embedding.
    Uses OpenAI text-embedding-3-small if API key is configured,
    otherwise generates a deterministic pseudo-random embedding vector for offline testing.
    """
    if settings.OPENAI_API_KEY:
        try:
            client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            resp = await client.embeddings.create(
                model="text-embedding-3-small",
                input=text[:8000]
            )
            return resp.data[0].embedding
        except Exception as e:
            logger.error(f"OpenAI embedding error: {e}")

    # Deterministic fallback embedding for local development without OpenAI credentials
    hasher = hashlib.sha256(text.encode("utf-8")).digest()
    vec = []
    for i in range(VECTOR_DIMENSION):
        byte_val = hasher[i % len(hasher)]
        vec.append(((byte_val + i) % 100) / 100.0 - 0.5)
    return vec

async def upsert_document_chunks(
    tenant_id: str,
    company_id: str,
    doc_id: str,
    filename: str,
    chunks: List[str]
) -> int:
    """
    Embeds and stores text chunks for a document, tagged by tenant and company.
    """
    client = get_qdrant_client()
    points = []

    for idx, chunk in enumerate(chunks):
        embedding = await generate_embedding(chunk)
        point_id = hashlib.md5(f"{doc_id}_{idx}".encode("utf-8")).hexdigest()
        payload = {
            "tenant_id": str(tenant_id),
            "company_id": str(company_id),
            "doc_id": str(doc_id),
            "filename": filename,
            "chunk_index": idx,
            "text": chunk
        }

        # Save to local in-memory store for fallback
        _in_memory_docs.append({
            "id": point_id,
            "vector": embedding,
            "payload": payload
        })

        if client:
            points.append(
                qmodels.PointStruct(
                    id=point_id,
                    vector=embedding,
                    payload=payload
                )
            )

    if client and points:
        try:
            client.upsert(
                collection_name=COLLECTION_NAME,
                points=points
            )
        except Exception as e:
            logger.warning(f"Failed to upsert to Qdrant, saved to memory fallback: {e}")

    return len(chunks)

async def search_documents(
    tenant_id: str,
    query: str,
    company_id: Optional[str] = None,
    limit: int = 4
) -> List[Dict[str, Any]]:
    """
    Searches documents using vector cosine similarity filtered strictly by tenant_id.
    """
    query_vector = await generate_embedding(query)
    client = get_qdrant_client()

    if client:
        try:
            must_conditions = [
                qmodels.FieldCondition(
                    key="tenant_id",
                    match=qmodels.MatchValue(value=str(tenant_id))
                )
            ]
            if company_id:
                must_conditions.append(
                    qmodels.FieldCondition(
                        key="company_id",
                        match=qmodels.MatchValue(value=str(company_id))
                    )
                )

            search_result = client.search(
                collection_name=COLLECTION_NAME,
                query_vector=query_vector,
                query_filter=qmodels.Filter(must=must_conditions),
                limit=limit
            )

            return [
                {
                    "score": hit.score,
                    "filename": hit.payload.get("filename", "Unknown Document"),
                    "text": hit.payload.get("text", ""),
                    "chunk_index": hit.payload.get("chunk_index", 0),
                    "company_id": hit.payload.get("company_id")
                }
                for hit in search_result
            ]
        except Exception as e:
            logger.warning(f"Qdrant query failed, falling back to local search: {e}")

    # In-memory fallback search
    results = []
    for doc in _in_memory_docs:
        payload = doc["payload"]
        if str(payload.get("tenant_id")) != str(tenant_id):
            continue
        if company_id and str(payload.get("company_id")) != str(company_id):
            continue

        # Dot product approximation for similarity
        score = sum(a * b for a, b in zip(query_vector[:100], doc["vector"][:100]))
        results.append({
            "score": float(score),
            "filename": payload.get("filename", "Unknown"),
            "text": payload.get("text", ""),
            "chunk_index": payload.get("chunk_index", 0),
            "company_id": payload.get("company_id")
        })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:limit]
