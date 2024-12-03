from fastapi import HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import PyPDF2
from pinecone import Pinecone, ServerlessSpec
import io
import os

# Model for the request to ask questions
class QueryRequest(BaseModel):
    question: str

# Model for the initialization request
class InitRequest(BaseModel):
    domain: str

# Mapping of domain names to namespaces (e.g., example.com -> namespace1)
domain_namespace = {}

class CustomEmbeddingFunction:
    def __init__(self, model):
        self.model = model

    def embed_documents(self, input):
        return self.model.encode(input, convert_to_tensor=True)
    
    def embed_query(self, input):
        return self.model.encode(input, convert_to_tensor=True)


async def create_embeddings2(namespace: str = Form(...), file: UploadFile = File(None)):
    try:
        # Initialize Pinecone
        pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))

        # Ensure a file is uploaded
        if not file:
            raise HTTPException(status_code=400, detail="No file provided.")

        # Read file content
        file_content = await file.read()
        file_name = file.filename.lower()

        # Process based on file type
        if file_name.endswith('.txt'):
            try:
                file_text = file_content.decode('utf-8')  # Decode bytes to string
            except UnicodeDecodeError:
                raise HTTPException(status_code=400, detail="File encoding not supported. Only UTF-8 is supported.")
        elif file_name.endswith('.pdf'):
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
            file_text = "".join(page.extract_text() for page in pdf_reader.pages if page.extract_text())
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Only .pdf and .txt are supported.")

        # Use SentenceTransformer to create embeddings
        embeddings_model = SentenceTransformer('all-MiniLM-L6-v2')

        # Split text into chunks
        chunk_size = 500
        chunks = [file_text[i:i + chunk_size] for i in range(0, len(file_text), chunk_size)]

        # Generate embeddings for each chunk
        chunk_embeddings = [embeddings_model.encode(chunk) for chunk in chunks]

        # Index name in Pinecone (namespace)
        index_name = namespace
        embedding_dimension = 384  # Dimension for 'all-MiniLM-L6-v2'

        # Create index in Pinecone if not exists
        if index_name not in pc.list_indexes():
            pc.create_index(name=index_name, dimension=embedding_dimension, metric='euclidean',
                            spec=ServerlessSpec(cloud='aws', region='us-east-1'))

        index = pc.Index(index_name)

        # Add embeddings to Pinecone
        vectors = [
            (f"{namespace}_chunk_{i}", embedding.tolist(), {"text": chunk_text})
            for i, (embedding, chunk_text) in enumerate(zip(chunk_embeddings, chunks))
        ]
        index.upsert(vectors)

        print(f"Created embeddings in Pinecone under index: {namespace}")
        return {"message": "Embeddings created and stored successfully."}

    except Exception as e:
        # Handle unexpected errors gracefully
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


# Function to create embeddings and store in Pinecone
async def create_embeddings(namespace: str = Form(...), file: UploadFile = File(None), text: str = Form(None)):
    pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
    try:
        # Determine whether to process uploaded file or direct text
        if text:
            # Ensure `text` is an iterable (list of strings)
            print(f"DEBUG: Received text type: {type(text)}")
            if isinstance(text, str):
                file_text = text  # If it's a single string, use it as-is
            elif isinstance(text, list):
                file_text = " ".join(text)  # Join list of strings into one string
            else:
                raise HTTPException(status_code=400, detail="Invalid input for text. Must be a string or list of strings.")

        elif file:
            file_content = await file.read()
            file_name = file.filename.lower()

            if file_name.endswith('.pdf'):
                # Process PDF files
                pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
                file_text = ""
                for page in pdf_reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        file_text += page_text
            elif file_name.endswith('.txt'):
                # Process TXT files
                try:
                    file_text = file_content.decode('utf-8')  # Decode bytes to string
                except UnicodeDecodeError:
                    raise HTTPException(status_code=400, detail="File encoding not supported. Only UTF-8 is supported.")
            else:
                raise HTTPException(status_code=400, detail="Unsupported file format. Only .pdf and .txt are supported.")
        else:
            raise HTTPException(status_code=400, detail="No file or text provided.")

        # Log extracted text for debugging (first 200 characters)
        # print("Extracted Text: ", len(file_text))

        # Use SentenceTransformer to create embeddings
        embeddings_model = SentenceTransformer('all-MiniLM-L6-v2')

        # Split text into chunks
        chunk_size = 500  # Adjust chunk size if necessary
        chunks = [file_text[i:i + chunk_size] for i in range(0, len(file_text), chunk_size)]
        
        # print(type(chunks[0]))


        # Generate embeddings for each chunk
        chunk_embeddings = [embeddings_model.encode(chunk) for chunk in chunks]

        # Ensure embeddings are a flat list
        # print("Embedding dimensions: ", type(chunk_embeddings[0]))

        # Index name in Pinecone (namespace)
        index_name = namespace
        embedding_dimension = 384  # Size for 'all-MiniLM-L6-v2'

        if index_name not in pc.list_indexes():
            pc.create_index(name=index_name, dimension=embedding_dimension, metric='euclidean',
                            spec=ServerlessSpec(cloud='aws', region='us-east-1'))

        index = pc.Index(index_name)

        # Add chunks to Pinecone index with metadata
        vectors = [
            (f"{namespace}_chunk_{i}", embedding.tolist(), {"text": chunk_text})
            for i, (embedding, chunk_text) in enumerate(zip(chunk_embeddings, chunks))
        ]

        # Upsert vectors to Pinecone
        index.upsert(vectors)

        print(f"Created embeddings in Pinecone under index: {namespace}")

        return {"message": "Embeddings created and stored successfully"}

    except Exception as e:
        print(f"Error: {str(e)}")  # Replace with proper logging in production
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
