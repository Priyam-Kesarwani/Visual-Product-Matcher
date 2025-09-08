// compute average color from an image URL or File using canvas
export function computeAvgColorFromImageUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous' // attempt CORS
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      // downscale to speed up
      const W = 100, H = Math.round((img.naturalHeight / img.naturalWidth) * 100) || 100
      canvas.width = W; canvas.height = H
      ctx.drawImage(img, 0, 0, W, H)
      try {
        const data = ctx.getImageData(0,0,W,H).data
        const avg = [0,0,0]
        let count = 0
        for (let i=0;i<data.length;i+=4){
          avg[0]+=data[i]; avg[1]+=data[i+1]; avg[2]+=data[i+2]; count++
        }
        avg[0]=Math.round(avg[0]/count)
        avg[1]=Math.round(avg[1]/count)
        avg[2]=Math.round(avg[2]/count)
        resolve(avg)
      } catch (err) {
        reject(err)
      }
    }
    img.onerror = (e) => reject(new Error('Image load error'))
    img.src = url
    // if cached and already complete:
    if (img.complete) {
      img.onload()
    }
  })
}

export function computeAvgColorFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        // downscale
        const W = 100, H = Math.round((img.naturalHeight / img.naturalWidth) * 100) || 100
        canvas.width = W; canvas.height = H
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, W, H)
        try {
          const data = ctx.getImageData(0,0,W,H).data
          const avg = [0,0,0]
          let count = 0
          for (let i=0;i<data.length;i+=4){
            avg[0]+=data[i]; avg[1]+=data[i+1]; avg[2]+=data[i+2]; count++
          }
          avg[0]=Math.round(avg[0]/count)
          avg[1]=Math.round(avg[1]/count)
          avg[2]=Math.round(avg[2]/count)
          resolve(avg)
        } catch (err) { reject(err) }
      }
      img.onerror = () => reject(new Error('File image load error'))
      img.src = reader.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
