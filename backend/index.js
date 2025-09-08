const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios'); // Proxy ke liye

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploads statically
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/uploads', express.static(uploadsDir));

// Load products.json
const productsPath = path.join(__dirname, 'products.json');
let products = [];
try {
  products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
} catch (err) {
  console.error('Error reading products.json:', err.message);
  products = [];
}

// GET /api/products -> list products
app.get('/api/products', (req, res) => {
  res.json({ ok: true, count: products.length, products });
});

// Multer setup for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safe = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, safe);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/upload -> accept single image file and return URL
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, message: 'No file uploaded' });
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ ok: true, url: fileUrl });
});

// PROXY endpoint for URL paste (CORS-free)
app.get('/api/proxy-image', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing url parameter');
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    res.set('Content-Type', response.headers['content-type']);
    res.send(response.data);
  } catch (err) {
    console.error('Proxy fetch error:', err.message);
    res.status(500).send('Failed to fetch image via proxy');
  }
});

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`VPM backend running on port ${PORT}`));
