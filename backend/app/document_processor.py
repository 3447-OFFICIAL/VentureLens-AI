import os
from llama_parse import LlamaParse
from langchain.text_splitter import RecursiveCharacterTextSplitter
from .database import settings

async def process_document(file_path: str, filename: str) -> list[str]:
    """
    Parses a document using LlamaParse and chunks it using LangChain.
    """
    if not settings.LLAMA_CLOUD_API_KEY:
        # Stub implementation if API key is not provided yet
        print("Warning: LLAMA_CLOUD_API_KEY not set. Using stub parser.")
        text = f"Stub content for {filename}. This represents the extracted text from the document."
        documents = [text]
    else:
        # Initialize LlamaParse
        # Note: LlamaParse supports pdf, docx, pptx, xlsx, etc.
        parser = LlamaParse(
            api_key=settings.LLAMA_CLOUD_API_KEY,
            result_type="markdown",
            verbose=True
        )
        
        # LlamaParse load_data expects a file path
        # If it's an async environment, we might need to run this in a threadpool
        # but for simplicity we'll just call it
        try:
            parsed_docs = parser.load_data(file_path)
            # Combine the text from all parsed pages
            text = "\n".join([doc.text for doc in parsed_docs])
        except Exception as e:
            print(f"Error parsing document with LlamaParse: {e}")
            text = f"Failed to parse {filename}"

    # Chunk the document using LangChain's RecursiveCharacterTextSplitter
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
        is_separator_regex=False,
    )
    
    chunks = text_splitter.split_text(text)
    return chunks
