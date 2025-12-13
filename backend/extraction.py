#extraction.py
import fitz
from docx import Document
import trafilatura
import re
import tempfile
import cv2
import numpy as np
import easyocr
from newspaper import Article
import requests
from bs4 import BeautifulSoup

reader = easyocr.Reader(['en'])


# ----------------------------------------------------
# SAFE TITLE EXTRACTION
# ----------------------------------------------------
def extract_title(text):
    if not isinstance(text, str) or not text:
        return "Unknown Title"

    cleaned = re.sub(r"\s+", " ", text).strip()
    return " ".join(cleaned.split()[:10]) if cleaned else "Unknown Title"


# ----------------------------------------------------
# CLEAN TEXT (VERY IMPORTANT)
# ----------------------------------------------------
def clean_text(text):
    if not text:
        return ""

    text = text.replace("\ufeff", "")  # UTF-8 BOM
    text = text.replace("\r", " ")
    text = text.replace("\t", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


# ----------------------------------------------------
# PDF EXTRACTION
# ----------------------------------------------------
async def extract_from_pdf(file):
    pdf_bytes = await file.read()
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")

    text = ""
    for page in doc:
        text += page.get_text()

    text = clean_text(text)
    if not text:
        text = "No text extracted from PDF."

    return extract_title(text), text


# ----------------------------------------------------
# DOCX EXTRACTION
# ----------------------------------------------------
async def extract_from_docx(file):
    doc_bytes = await file.read()
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".docx")
    tmp.write(doc_bytes)
    tmp.close()

    doc = Document(tmp.name)
    text = "\n".join(p.text for p in doc.paragraphs)

    text = clean_text(text)

    if not text:
        text = "No text extracted from Word document."

    return extract_title(text), text


# ----------------------------------------------------
# TXT EXTRACTION (BUG FIX FIX FIX)
# ----------------------------------------------------
async def extract_from_txt(file):
    raw = await file.read()

    try:
        text = raw.decode("utf-8", errors="ignore")
    except:
        text = raw.decode("latin-1", errors="ignore")

    text = clean_text(text)

    if len(text) < 5:
        text = "The text file contains no readable content."

    return extract_title(text), text


# ----------------------------------------------------
# URL EXTRACTION
# ----------------------------------------------------
def extract_from_url(url):
    text = ""

    # -------------------------------
    # 1) Trafilatura standard
    # -------------------------------
    downloaded = trafilatura.fetch_url(url)
    if downloaded:
        extracted = trafilatura.extract(downloaded, include_comments=False)
        if extracted and len(extracted.strip()) > 300:
            return extract_title(extracted), clean_text(extracted)

    # -------------------------------
    # 2) Trafilatura BARE (parses raw HTML)
    # -------------------------------
    try:
        bare = trafilatura.bare_extraction(downloaded)
        if bare and "text" in bare and len(bare["text"].strip()) > 300:
            return extract_title(bare["text"]), clean_text(bare["text"])
    except:
        pass

    # -------------------------------
    # 3) BeautifulSoup fallback for JS websites
    # -------------------------------
    try:
        response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(response.text, "html.parser")

        article_tags = soup.find_all(["p"], limit=30)
        bs_text = " ".join([tag.get_text(strip=True) for tag in article_tags])

        if len(bs_text.strip()) > 200:
            return extract_title(bs_text), clean_text(bs_text)
    except:
        pass

    # -------------------------------
    # 4) Newspaper3k (last fallback)
    # -------------------------------
    try:
        article = Article(url)
        article.download()
        article.parse()
        if len(article.text.strip()) > 200:
            cleaned = clean_text(article.text)
            return extract_title(cleaned), cleaned
    except:
        pass

    # -------------------------------
    # 5) COMPLETE FAILURE → return explicit message
    # -------------------------------
    return (
        "Extraction Failed",
        "The article could not be extracted. The website may block bots or require JavaScript."
    )

# ----------------------------------------------------
# IMAGE OCR EXTRACTION
# ----------------------------------------------------
async def extract_from_image(file):
    img_bytes = await file.read()

    npimg = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    try:
        results = reader.readtext(img, detail=0)
        text = clean_text(" ".join(results))
    except:
        text = "Image could not be processed."

    if not text:
        text = "No readable text detected in the image."

    return extract_title(text), text
