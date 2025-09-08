import os
from PIL import Image
import json
import random

# -------------------------------
# 1️⃣ Folders
# -------------------------------
frontend_public = "frontend/public"
images_folder = os.path.join(frontend_public, "images")

# Create images folder if not exists
os.makedirs(images_folder, exist_ok=True)

# -------------------------------
# 2️⃣ Colors for images (RGB)
# -------------------------------
colors = [
    (255,0,0),     # Red
    (0,255,0),     # Green
    (0,0,255),     # Blue
    (255,255,0),   # Yellow
    (255,165,0),   # Orange
    (255,192,203), # Pink
    (128,0,128),   # Purple
    (165,42,42),   # Brown
    (128,128,128), # Grey
    (0,255,255)    # Cyan
]

categories = ["Shoes","Shirts","Bags","Accessories"]

# -------------------------------
# 3️⃣ Generate 50 images
# -------------------------------
products = []

for i in range(1, 51):
    # Random color
    color = random.choice(colors)
    
    # Create 400x400 image
    img = Image.new("RGB", (400,400), color)
    
    # Save image
    img_path = os.path.join(images_folder, f"{i}.jpg")
    img.save(img_path)

    # Random product data
    product = {
        "id": i,
        "name": f"Sample Product {i}",
        "category": random.choice(categories),
        "image": f"/images/{i}.jpg",
        "price": round(random.uniform(10,200),2),
        "description": f"Placeholder product {i}",
        "avg_color": list(color)
    }
    products.append(product)

# -------------------------------
# 4️⃣ Save products.json
# -------------------------------
products_json_path = os.path.join("backend","products.json")
os.makedirs("backend", exist_ok=True)
with open(products_json_path,"w") as f:
    json.dump(products, f, indent=2)

print("✅ 50 images generated in frontend/public/images/")
print(f"✅ products.json saved at {products_json_path}")
