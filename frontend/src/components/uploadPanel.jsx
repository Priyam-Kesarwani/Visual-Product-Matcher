import React, { useRef, useState } from 'react'
import axios from 'axios'
import { computeAvgColorFromFile, computeAvgColorFromImageUrl } from '../utils/imageUtils'

export default function UploadPanel({ onQuery, backend }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)
  const fileRef = useRef()

  // ------------------- FILE UPLOAD -------------------
  async function handleFile(e) {
    setError(''); setLoading(true)
    const file = e.target.files[0]
    if (!file) { setLoading(false); return }
    try {
      const imageUrl = URL.createObjectURL(file)
      setPreview(imageUrl)
      const avgColor = await computeAvgColorFromFile(file)
      onQuery({ imageUrl, avgColor })
    } catch (err) {
      console.error(err); setError('Failed to process file')
    } finally { setLoading(false) }
  }

  // ------------------- URL PASTE -------------------
  async function handlePasteUrl() {
    const url = prompt('Paste image URL here:')
    if (!url) return
    setError(''); setLoading(true)
    try {
      // Use backend proxy to bypass CORS
      const proxyUrl = `${backend}/api/proxy-image?url=${encodeURIComponent(url)}`
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = proxyUrl
      img.onload = async () => {
        const avgColor = await computeAvgColorFromImageUrl(proxyUrl)
        setPreview(proxyUrl)
        onQuery({ imageUrl: proxyUrl, avgColor })
        setLoading(false)
      }
      img.onerror = () => {
        setError('Unable to load image via proxy. Try upload instead.')
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      setError('Unable to load image via proxy. Try upload instead.')
      setLoading(false)
    }
  }

  // ------------------- UPLOAD TO SERVER -------------------
  async function handleUploadToServer() {
    const input = fileRef.current
    if (!input.files || !input.files[0]) return alert('Choose a file first to upload')
    const form = new FormData()
    form.append('image', input.files[0])
    try {
      setLoading(true); setError('')
      const res = await axios.post(`${backend}/api/upload`, form, {
        headers: {'Content-Type': 'multipart/form-data'}
      })
      if (res.data && res.data.url) {
        alert('Uploaded. Server URL: ' + res.data.url)
      }
    } catch (err) {
      console.error(err); setError('Upload failed')
    } finally { setLoading(false) }
  }

  // ------------------- RENDER -------------------
  return (
    <div className="upload-panel card">
      <div className="upload-actions">
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile}/>
        <button onClick={handlePasteUrl} className="btn">Use Image URL</button>
        <button onClick={handleUploadToServer} className="btn muted">Upload to Server</button>
      </div>

      <div className="preview">
        {loading ? <div className="mini-loader"/> : (
          preview ? <img src={preview} alt="preview" /> : <div className="placeholder">No image selected</div>
        )}
      </div>

      {error && <div className="error">{error}</div>}
      <div className="hint">Tip: If a pasted URL fails due to CORS, use the proxy or upload file instead.</div>
    </div>
  )
}
