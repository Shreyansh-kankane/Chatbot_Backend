import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from queue import Queue
from datetime import datetime
from createEmbeddings import create_embeddings

# Function to scrape website
async def scrape_website(base_url, output_folder="./data", max_pages=1500, max_depth=7):
    visited = set()  # Track visited URLs
    q = Queue()
    q.put((base_url, 0))  # Queue holds tuples of (URL, depth)
    pages_scraped = 0  # Track the number of pages scraped

    # Ensure the output folder exists
    os.makedirs(output_folder, exist_ok=True)

    # Generate the output file name based on the URL and current date
    output_file = f"{urlparse(base_url).netloc}_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.txt"
    output_path = os.path.join(output_folder, output_file)

    all_scraped_texts = []  # To store all the scraped texts

    while not q.empty() and pages_scraped < max_pages:
        url, depth = q.get()

        # Skip already visited URLs or URLs exceeding max depth
        if url in visited or depth > max_depth:
            continue

        visited.add(url)
        pages_scraped += 1
        print(f"Scraping: {url} (Depth: {depth})")

        try:
            response = requests.get(url, timeout=10)  # Set a timeout for the request
            response.raise_for_status()  # Raise an error for bad status codes
        except requests.exceptions.RequestException as e:
            print(f"Failed to fetch {url}: {e}")
            continue

        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract and clean the text content
        text_content = soup.get_text(separator=' ')
        clean_text = ' '.join(text_content.split())
        
        # Save the clean text in the list
        all_scraped_texts.append(clean_text)

        # Write the cleaned text to the file incrementally
        with open(output_path, "a", encoding="utf-8") as file:
            file.write(f"URL: {url}\n")
            file.write(f"Depth: {depth}\n")
            file.write(clean_text + "\n\n")
            print(f"Content written for: {url}")

        # Extract all the links in the current page
        for link in soup.find_all('a', href=True):
            href = link['href']
            full_url = urljoin(base_url, href)

            # Ensure the link belongs to the same domain and is not visited
            if is_same_domain(base_url, full_url) and full_url not in visited and not is_excluded_file_type(full_url):
                q.put((full_url, depth + 1))

    print(f"Scraping completed. Data saved to: {output_path} \n")

    # Trigger the embedding creation process after scraping is finished
    await create_embeddings_from_scraped_data(all_scraped_texts)

# Function to create embeddings after scraping is done
async def create_embeddings_from_scraped_data(scraped_texts):
    try:
        # Generate embeddings for each chunk of scraped text
        namespace = "pecdata2"
        await create_embeddings(text=scraped_texts, namespace=namespace)

        print("Embeddings created ans stored in Pinecone successfully.")

    except Exception as e:
        print(f"Error during embedding creation: {str(e)}")
        raise

# Check if the target URL belongs to the same domain as the base URL
def is_same_domain(base_url, target_url):
    """
    Check if the target URL belongs to the same domain as the base URL.
    """
    base_netloc = urlparse(base_url).netloc
    target_netloc = urlparse(target_url).netloc
    return base_netloc == target_netloc


def is_excluded_file_type(url):
    """
    Check if the URL points to an excluded file type (e.g., images, PDFs).
    """
    excluded_extensions = {'.png', '.jpeg', '.jpg', '.gif', '.bmp', '.tiff', '.pdf'}
    path = urlparse(url).path
    extension = os.path.splitext(path)[1].lower()
    return extension in excluded_extensions
