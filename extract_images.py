import fitz
import os

pdf_path = r"C:\Users\Santi\Desktop\PrIn2 Diseño\Media\dark revival-coleccion.pdf"
out_dir = r"c:\Users\Santi\Desktop\PrIn2 Diseño\Prototipo\src\public\uploads"

doc = fitz.open(pdf_path)
for i in [4, 5, 6]: # pages 5, 6, 7 (0-indexed)
    page = doc.load_page(i)
    pix = page.get_pixmap(dpi=150)
    pix.save(os.path.join(out_dir, f"design_page_{i+1}.png"))
    print(f"Saved design_page_{i+1}.png")
