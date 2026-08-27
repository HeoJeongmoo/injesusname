import { useEffect, useState } from 'react'

// Composer gallery: large left image with text overlay, stacked images on the right.
const modules = import.meta.glob('../assets/*.{jpg,jpeg,png,svg}', { eager: true }) as Record<string, { default: string }>
const all = Object.values(modules).map((m) => m.default)

function getImageInfo(url: string): Promise<{ avg: number; width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = url
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const w = 40
        const h = 40
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) return resolve({ avg: 128, width: img.naturalWidth, height: img.naturalHeight })
        ctx.drawImage(img, 0, 0, w, h)
        const data = ctx.getImageData(0, 0, w, h).data
        let total = 0
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
          total += lum
        }
        const avg = total / (data.length / 4)
        resolve({ avg, width: img.naturalWidth, height: img.naturalHeight })
      } catch {
        resolve({ avg: 128, width: img.naturalWidth, height: img.naturalHeight })
      }
    }
    img.onerror = () => resolve({ avg: 128, width: 1, height: 1 })
  })
}

export default function FullBleedGallery() {
  const chosen = all.slice(0, 4)

  const [overlays, setOverlays] = useState<Record<string, number>>({})

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const map: Record<string, number> = {}
      for (const url of chosen) {
        const info = await getImageInfo(url)
        const avg = info.avg
        let overlay = 0.32
        if (avg > 220) overlay = 0.6
        else if (avg > 170) overlay = 0.45
        else if (avg > 120) overlay = 0.32
        else overlay = 0.12
        map[url] = overlay
      }
      if (mounted) setOverlays(map)
    })()
    return () => {
      mounted = false
    }
  }, [])

  if (chosen.length === 0) return null

  const left = chosen[0]
  const rightTop = chosen[1]
  const rightBottom = chosen[2] ?? chosen[1]
  const extra = chosen[3]

  return (
    <section className="w-full m-0 p-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Large left image with text overlay */}
          <div className="relative overflow-hidden h-[85vh]">
            <img src={left} alt="feature-left" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${overlays[left] ?? 0.32})` }} />
            <div className="absolute left-8 bottom-12 text-white max-w-lg">
              <h2 className="font-bebas text-4xl text-start md:text-6xl tracking-tight">Men — Heritage Collection</h2>
              <p className="mt-3 text-sm md:text-base opacity-90">Tailored outerwear & essential pieces — curated looks on real people.</p>
            </div>
            {/* CTA removed by request */}
          </div>

          {/* Right column stacked */}
          <div className="grid grid-rows-2 gap-0">
            <div className="relative overflow-hidden h-[42.5vh]">
              <img src={rightTop} alt="feature-top" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${overlays[rightTop] ?? 0.32})` }} />
              <div className="absolute left-4 bottom-4 text-white font-bebas text-sm">New arrivals</div>
              {/* CTA removed by request */}
            </div>

            <div className="relative overflow-hidden h-[42.5vh]">
              <img src={rightBottom} alt="feature-bottom" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${overlays[rightBottom] ?? 0.32})` }} />
              {extra && <div className="absolute right-4 top-4 bg-white/10 px-3 py-1 rounded text-white text-xs">Shop the look</div>}
              {/* CTA removed by request */}
            </div>
          </div>
      </div>
    </section>
  )
}
