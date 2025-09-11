import React, { useEffect, useState } from 'react'
import axios from 'axios'
import UploadPanel from './components/UploadPanel'
import ProductGrid from './components/ProductGrid'
import Loader from './components/Loader'
import './styles.css';




const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

export default function App() {
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [matches, setMatches] = useState([])
  const [queryImage, setQueryImage] = useState(null)
  const [minScore, setMinScore] = useState(0)

  useEffect(() => {
    async function load() {
      try {
        setLoadingProducts(true)
        const res = await axios.get(`${BACKEND}/api/products`)
        if (res.data && res.data.products) setProducts(res.data.products)
      } catch (err) {
        console.error('Failed to load products', err)
      } finally {
        setLoadingProducts(false)
      }
    }
    load()
  }, [])

  // Called by UploadPanel with {imageUrl, averageColor}
  const handleQuery = (payload) => {
    setQueryImage(payload.imageUrl)
    // compute similarity against products using avg_color
    if (!payload.avgColor) {
      setMatches([])
      return
    }
    const q = payload.avgColor // [r,g,b]
    // compute Euclidean distance to each product avg_color -> convert to similarity score 0..100
    const scored = products.map(p => {
      let pc = p.avg_color || [127,127,127]
      const dist = Math.sqrt(
        (pc[0]-q[0])**2 + (pc[1]-q[1])**2 + (pc[2]-q[2])**2
      )
      // max possible dist ≈ 441. so similarity = 100*(1 - dist/441)
      const sim = Math.max(0, Math.round((1 - dist / 441) * 100))
      return {...p, score: sim}
    })
    scored.sort((a,b) => b.score - a.score)
    setMatches(scored)
  }

  const filtered = matches.filter(m => m.score >= minScore)

  return (
    <>
      <div className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-mark">VM</span>
            <span className="brand-name">Visual Matcher</span>
          </div>
          <nav className="top-actions">
            <a href="#upload" className="top-link">Upload</a>
            <a href="#results" className="top-link">Results</a>
          </nav>
        </div>
      </div>

      <div className="container">
        <header>
          <h1>Find Products That Match Your Image</h1>
          <p className="subtitle">Upload a photo or paste a link — we’ll surface the closest visual matches.</p>
        </header>

        <main>
          <section id="upload">
            <UploadPanel onQuery={handleQuery} backend={BACKEND} />
          </section>
          {loadingProducts ? <Loader /> : (
            <>
              <div className="filter-row">
                <label>
                  Show results with similarity ≥ <strong>{minScore}</strong>
                </label>
                <input type="range" min="0" max="100" value={minScore} onChange={(e)=>setMinScore(Number(e.target.value))}/>
              </div>

              <section className="results" id="results">
                <h2>Similar Products {queryImage ? `for your image` : ''}</h2>
                <ProductGrid products={filtered} queryImage={queryImage}/>
              </section>
            </>
          )}
        </main>
      
      
      </div>
    </>
  )
}
