import fitz
from docx import Document
import trafilatura
import re
import tempfile
import cv2
import numpy as np
import easyocr

# OCR reader
reader = easyocr.Reader(['en'])


# ============================================================
# FIXED TITLE EXTRACTION (no crash)
# ============================================================
def extract_title(text):
    """Safely extract a title from text."""
    if not isinstance(text, str) or text is None:
        return "Unknown Title"

    cleaned = re.sub(r"\s+", " ", text).strip()
    if cleaned == "":
        return "Unknown Title"

    return " ".join(cleaned.split()[:10])


# ============================================================
# PDF EXTRACTION
# ============================================================
async def extract_from_pdf(file):
    pdf_bytes = await file.read()
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")

    text = ""
    for page in doc:
        text += page.get_text()

    if not text or text.strip() == "":
        text = "No text extracted from PDF."

    title = extract_title(text)

    return title, text


# ============================================================
# DOCX EXTRACTION
# ============================================================
async def extract_from_docx(file):
    doc_bytes = await file.read()

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".docx")
    tmp.write(doc_bytes)
    tmp.close()

    doc = Document(tmp.name)
    paragraphs = [p.text for p in doc.paragraphs]
    text = "\n".join(paragraphs)

    if not text or text.strip() == "":
        text = "No text extracted from Word document."

    title = extract_title(text)

    return title, text


# ============================================================
# TXT EXTRACTION
# ============================================================
async def extract_from_txt(file):
    txt = await file.read()

    try:
        text = txt.decode("utf-8")
    except:
        text = "Could not decode text file."

    title = extract_title(text)

    return title, text


# ============================================================
# URL EXTRACTION (MAIN FIX HERE)
# ============================================================
def extract_from_url(url):
    downloaded = trafilatura.fetch_url(url)
    text = trafilatura.extract(downloaded)

    # 🔥 FIX: website blocks scraping → text is None
    if text is None or text.strip() == "":
        text = (
            "No readable text extracted from this article. "
            "The website may block scraping or require JavaScript to load the content."
        )

    title = extract_title(text)
    return title, text


# ============================================================
# IMAGE OCR EXTRACTION
# ============================================================
async def extract_from_image(file):
    img_bytes = await file.read()

    try:
        npimg = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
        results = reader.readtext(img, detail=0)
        text = " ".join(results)

        if text.strip() == "":
            text = "No readable text detected in the image."

    except Exception:
        text = "Image could not be processed."

    title = extract_title(text)

    return title, text
