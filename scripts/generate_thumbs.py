import os
import sys
from pathlib import Path
from PIL import Image

IMAGES_DIR = Path(__file__).parent.parent / "assets" / "images"
THUMBS_DIR = IMAGES_DIR / "thumbs"
MAX_WIDTH = 800
QUALITY = 60

def generate_thumbs():
    THUMBS_DIR.mkdir(exist_ok=True)
    
    image_extensions = {".png", ".jpg", ".jpeg", ".gif", ".webp"}
    skip_patterns = {"avatar", "favicon"}
    
    images = [
        f for f in IMAGES_DIR.iterdir()
        if f.is_file()
        and f.suffix.lower() in image_extensions
        and not any(p in f.name.lower() for p in skip_patterns)
    ]
    
    total_original = 0
    total_thumb = 0
    generated = 0
    skipped = 0
    
    for img_path in sorted(images):
        thumb_name = img_path.stem + ".jpg"
        thumb_path = THUMBS_DIR / thumb_name
        
        if thumb_path.exists() and thumb_path.stat().st_mtime >= img_path.stat().st_mtime:
            skipped += 1
            total_original += img_path.stat().st_size
            total_thumb += thumb_path.stat().st_size
            continue
        
        try:
            with Image.open(img_path) as img:
                original_size = img_path.stat().st_size
                
                if img.width > MAX_WIDTH:
                    ratio = MAX_WIDTH / img.width
                    new_height = int(img.height * ratio)
                    img = img.resize((MAX_WIDTH, new_height), Image.LANCZOS)
                
                img = img.convert("RGB")
                img.save(thumb_path, "JPEG", quality=QUALITY, optimize=True)
                
                thumb_size = thumb_path.stat().st_size
                total_original += original_size
                total_thumb += thumb_size
                generated += 1
                
                pct = (1 - thumb_size / original_size) * 100 if original_size > 0 else 0
                print(f"  {img_path.name} -> {thumb_name}  "
                      f"{original_size//1024}KB -> {thumb_size//1024}KB  (-{pct:.0f}%)")
        except Exception as e:
            print(f"  ERROR: {img_path.name} - {e}")
    
    print(f"\nDone: {generated} generated, {skipped} skipped")
    if total_original > 0:
        print(f"Total: {total_original//1024//1024}MB -> {total_thumb//1024//1024}MB  "
              f"(-{(1-total_thumb/total_original)*100:.0f}%)")

if __name__ == "__main__":
    generate_thumbs()
