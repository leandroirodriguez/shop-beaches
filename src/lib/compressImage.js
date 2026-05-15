// Client-side image compression via the Canvas API — no dependencies.
// Used before uploading cover + inline blog images to Supabase Storage.
//
// Defaults: max 1200×1200 px, JPEG quality 0.82. Always exports JPG
// regardless of source format (PNG/HEIC/WebP all get re-encoded).
// Aspect ratio is preserved.

export async function compressImage(file, {
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.82,
} = {}) {
  const dataUrl = await readFileAsDataUrl(file)
  const img = await loadImage(dataUrl)

  const scale = Math.min(1, maxWidth / img.width, maxHeight / img.height)
  const targetW = Math.round(img.width * scale)
  const targetH = Math.round(img.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = targetW
  canvas.height = targetH

  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, targetW, targetH)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (!blob) return reject(new Error('Image compression failed'))
        resolve(new File([blob], `${Date.now()}.jpg`, { type: 'image/jpeg' }))
      },
      'image/jpeg',
      quality
    )
  })
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
