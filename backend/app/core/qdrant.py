from qdrant_client import QdrantClient
from .config import settings

def get_qdrant_client() -> QdrantClient:
    """
    Returns a configured Qdrant Client.
    In local dev, connects to the Docker container.
    """
    client = QdrantClient(url=settings.QDRANT_HOST, port=6333)
    return client

def init_qdrant_collections():
    """
    Initialize Qdrant collections if they don't exist.
    """
    client = get_qdrant_client()
    collections = [col.name for col in client.get_collections().collections]
    
    if "documents" not in collections:
        client.create_collection(
            collection_name="documents",
            vectors_config={"size": 1536, "distance": "Cosine"} # OpenAI embedding size
        )
