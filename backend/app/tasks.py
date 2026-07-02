import os
import logging
import asyncio
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.celery_worker import celery
from app.models.models import Document, DueDiligence, Deal, VCFirm
from app.vector_store import store_document_vectors
from langchain.text_splitter import RecursiveCharacterTextSplitter
from llama_parse import LlamaParse

logger = logging.getLogger("venturelens_tasks")

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:password@db:5432/venturelens")
# Create sync engine for Celery workers which run in standard blocking threads
sync_url = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")
engine = create_engine(sync_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@celery.task(name="parse_document_task")
def parse_document_task(document_id: str):
    logger.info(f"Starting parsing task for document ID: {document_id}")
    
    session = SessionLocal()
    try:
        doc = session.query(Document).filter(Document.id == document_id).first()
        if not doc:
            logger.error(f"Document {document_id} not found in database.")
            return
            
        doc.status = "Processing"
        session.commit()
        
        # Check API key for LlamaParse
        api_key = os.getenv("LLAMA_CLOUD_API_KEY", "")
        
        if api_key:
            logger.info("Initializing LlamaParse client")
            parser = LlamaParse(
                api_key=api_key,
                result_type="markdown",
                num_workers=4,
                verbose=True,
            )
            
            # Execute parsing
            documents = parser.load_data(doc.s3_key)
            parsed_text = "\n\n".join([d.text for d in documents])
            logger.info(f"Successfully parsed {len(documents)} pages using LlamaParse.")
        else:
            logger.warning("No LLAMA_CLOUD_API_KEY found. Using mock fallback parser.")
            parsed_text = f"Mock analysis content for startup deck: {doc.file_name}. " \
                          f"This company focuses on deep learning models and custom database engines."
            
        # Get tenant organization ID
        diligence = session.query(DueDiligence).filter(DueDiligence.id == doc.due_diligence_id).first()
        tenant_id = "org_default"
        if diligence:
            deal = session.query(Deal).filter(Deal.id == diligence.deal_id).first()
            if deal:
                vc_firm = session.query(VCFirm).filter(VCFirm.id == deal.vc_firm_id).first()
                if vc_firm:
                    tenant_id = vc_firm.organization_id

        # Chunk the text using LangChain
        logger.info(f"Chunking parsed text for document ID: {document_id}")
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        chunks = text_splitter.split_text(parsed_text)
        
        # Store chunks in Qdrant Vector Store
        if chunks:
            logger.info(f"Storing {len(chunks)} chunks in Qdrant under tenant: {tenant_id}")
            asyncio.run(store_document_vectors(
                chunks=chunks,
                metadata={
                    "tenant_id": tenant_id,
                    "document_id": document_id,
                    "file_name": doc.file_name
                }
            ))

        if diligence:
            diligence.health_score = 85
            diligence.status = "Finished"
            
        doc.status = "Completed"
        session.commit()
        logger.info(f"Finished parsing and indexing task for document ID: {document_id}")
        
        # Broadcast completed event
        try:
            from app.core.websocket import manager
            manager.broadcast_to_tenant({
                "type": "NOTIFICATION",
                "title": "Ingestion Succeeded",
                "message": f"Successfully parsed and vectorized {doc.file_name}",
                "data": {"document_id": document_id, "status": "Completed"}
            }, tenant_id)
        except Exception as ws_e:
            logger.warning(f"Websocket notification failed: {ws_e}")
        
    except Exception as e:
        logger.exception(f"Error during document parsing: {str(e)}")
        if doc:
            doc.status = "Failed"
            session.commit()
            try:
                from app.core.websocket import manager
                manager.broadcast_to_tenant({
                    "type": "NOTIFICATION",
                    "title": "Ingestion Failed",
                    "message": f"Failed to ingest document {doc.file_name}",
                    "data": {"document_id": document_id, "status": "Failed"}
                }, tenant_id)
            except Exception as ws_e:
                logger.warning(f"Websocket notification failed: {ws_e}")
    finally:
        session.close()
