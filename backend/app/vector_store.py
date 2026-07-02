from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue
from langchain_openai import OpenAIEmbeddings
import uuid
from .core.config import settings

# Initialize Qdrant Client
qdrant_client = QdrantClient(url=settings.QDRANT_URL)

COLLECTION_NAME = "venturelens_docs"

# Initialize OpenAI Embeddings (stub if no key)
if settings.OPENAI_API_KEY:
    embeddings_model = OpenAIEmbeddings(api_key=settings.OPENAI_API_KEY)
else:
    # Stub embedding model that returns random vectors
    class StubEmbeddings:
        def embed_documents(self, texts):
            return [[0.1] * 1536 for _ in texts]
    embeddings_model = StubEmbeddings()

# Ensure collection exists without blocking local boot loops
try:
    qdrant_client.get_collection(collection_name=COLLECTION_NAME)
except Exception:
    try:
        qdrant_client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
        )
    except Exception as e:
        print(f"Warning: Qdrant collection could not be initialized: {str(e)}")


async def store_document_vectors(chunks: list[str], metadata: dict):
    """
    Generate embeddings for chunks and store them in Qdrant.
    """
    if not chunks:
        return
        
    embeddings = embeddings_model.embed_documents(chunks)
    
    points = [
        PointStruct(
            id=str(uuid.uuid4()),
            vector=embedding,
            payload={"text": chunk, **metadata}
        )
        for chunk, embedding in zip(chunks, embeddings)
    ]
    
    qdrant_client.upsert(
        collection_name=COLLECTION_NAME,
        points=points
    )
    
def search_documents(query: str, tenant_id: str, limit: int = 5):
    """
    Search for similar documents in Qdrant based on the query, restricted by tenant.
    """
    query_vector = embeddings_model.embed_documents([query])[0]
    
    search_result = qdrant_client.search(
        collection_name=COLLECTION_NAME,
        query_vector=query_vector,
        query_filter=Filter(
            must=[
                FieldCondition(
                    key="tenant_id",
                    match=MatchValue(value=tenant_id)
                )
            ]
        ),
        limit=limit
    )
    
    return [hit.payload["text"] for hit in search_result]
