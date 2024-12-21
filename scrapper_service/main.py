from fastapi import FastAPI, BackgroundTasks, Form , File, UploadFile
import webscrap
import createEmbeddings
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Health Check success!"}

# Define the route to scrape in the background
@app.get("/scrape")
async def scrap_router(base_url: str, namespace:str, background_tasks: BackgroundTasks):
    # Add the scrape task to the background
    background_tasks.add_task(webscrap.scrape_website, base_url,namespace)
    return {"message": f"Scraping for {base_url} has started in the background."}

@app.post('/createEmbeddings')
async def embedding_router(namespace: str = Form(...), file: UploadFile = File(...) ):
    result  = await createEmbeddings.create_embeddings2(namespace , file)
    return result
