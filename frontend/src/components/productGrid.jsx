import React from 'react'

export default function ProductGrid({ products, queryImage }) {
  if (!products?.length) return <div className="no-results">No results yet — try adjusting the similarity slider or upload a clearer image.</div>
  return (
    <div className="grid">
      {products.map(p => (
        <div className="card product" key={p.id}>
          <img src={p.image} alt={p.name} />
          <div className="meta">
            <h3>{p.name}</h3>
            <p className="cat">{p.category}</p>
            <p className="price">₹{p.price}</p>
            <div className="score">Similarity: <strong>{p.score}%</strong></div>
          </div>
        </div>
      ))}
    </div>
  )
}
