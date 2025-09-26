# Visual-Product-Matcher

A visual product matching system that, given a query image, finds visually similar products from a catalog.  
This project consists of a **frontend** (UI) and a **backend** (API / model) to power the matching.

## Table of Contents

- [Demo / Live Link](#demo--live-link)  
- [Features](#features)  
- [Architecture](#architecture)  
- [Installation & Setup](#installation--setup)  
- [Usage](#usage)  
- [Screenshots](#screenshots)
- 
## Demo / Live Link

You can check out the live frontend here:  
[visual-product-matcher-frontend](https://visual-product-matcher-frontend-theta.vercel.app/) :contentReference[oaicite:1]{index=1}

## Features

- Upload or select a query image  
- Compute feature embeddings & compare to catalog  
- Return top **K** visually similar products  
- Sort / filter results  
- Responsive UI for browsing matches

## Architecture

- **Frontend**: handles the UI, uploading images, showing results  
- **Backend**: API endpoints to accept image queries, run feature extraction, similarity search  
- **Matching Engine**: uses embeddings (e.g. CNN features) and nearest neighbor search to find top matches

## Installation & Setup

### Prerequisites

- Node.js (≥14)  
- Python (3.8+) or relevant environment  
- (Optional) GPU if using deep models for embedding

### Steps

1. Clone the repo  
   ```bash
   git clone https://github.com/Priyam-Kesarwani/Visual-Product-Matcher.git
   cd Visual-Product-Matcher
   ```

2. Setup backend
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
   
# Configure any environment variables (e.g. MODEL_PATH, DB_PATH)
python app.py

3. Setup frontend
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## Screenshots

<img width="1920" height="1080" alt="Screenshot 2025-09-26 184946" src="https://github.com/user-attachments/assets/11fdb347-167e-438f-8734-2fab8cbf8979" />

<img width="1920" height="1080" alt="Screenshot 2025-09-26 185002" src="https://github.com/user-attachments/assets/ce189180-f749-4c5a-bb87-ce76363e4305" />

<img width="1920" height="1080" alt="Screenshot 2025-09-26 185015" src="https://github.com/user-attachments/assets/19bfda05-17fb-4aeb-b31c-0e8c73007fe7" />

<img width="1920" height="1080" alt="Screenshot 2025-09-26 185050" src="https://github.com/user-attachments/assets/da3885c6-045d-481d-af76-787a453042c5" />

<img width="1920" height="1080" alt="Screenshot 2025-09-26 185102" src="https://github.com/user-attachments/assets/60335384-085c-45d7-9136-3f6d7b80102c" />

<img width="1920" height="1080" alt="Screenshot 2025-09-26 185127" src="https://github.com/user-attachments/assets/0a5585b1-9be2-42b5-aefa-c3069376f529" />

<img width="1920" height="1080" alt="Screenshot 2025-09-26 185138" src="https://github.com/user-attachments/assets/1dd3bc58-d01d-49e8-89fa-c3a368aa9402" />
