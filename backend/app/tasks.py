import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.celery_worker import celery
from app.models.models import Document, DueDiligence
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
            
            # Execute parsing asynchronously
            documents = parser.load_data(doc.s3_key)
            parsed_text = "\n\n".join([d.text for d in documents])
            logger.info(f"Successfully parsed {len(documents)} pages using LlamaParse.")
        else:
            logger.warning("No LLAMA_CLOUD_API_KEY found. Using mock fallback parser.")
            parsed_text = f"Mock analysis content for startup deck: {doc.file_name}"
            
        # Update due diligence metrics or record results
        diligence = session.query(DueDiligence).filter(DueDiligence.id == doc.due_diligence_id).first()
        if diligence:
            diligence.health_score = 85 # Set health score from AI mock run
            diligence.status = "Finished"
            
        doc.status = "Completed"
        session.commit()
        logger.info(f"Finished parsing task for document ID: {document_id}")
        
    except Exception as e:
        logger.exception(f"Error during document parsing: {str(e)}")
        if doc:
            doc.status = "Failed"
            session.commit()
    finally:
        session.close()
