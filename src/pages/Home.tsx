import IntroOverlay from '../components/IntroOverlay'
import ProductGrid from '../components/ProductGrid'
import BrandBanner from '../components/BrandBanner'
import FullBleedGallery from '../components/FullBleedGallery'
import { products as allProducts } from '../data/products'
import { Link } from 'react-router-dom'

export default function Home() {
  const menItems = allProducts.filter((p) => p.category === 'men')
  const womenItems = allProducts.filter((p) => p.category === 'women')

  return (
    <div>
      <IntroOverlay />

      {/* HERO */}
      <section className="relative w-full h-screen overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/visual.mp4"
          autoPlay
          muted
          loop
          playsInline
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 flex items-center h-full">
          <div className="w-full text-left text-white px-6 md:px-12 lg:px-20">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-bebas tracking-tight leading-tight">
              Whatever you do, do it in the name of Jesus
            </h1>
            <p className="mt-4 text-base md:text-lg opacity-90 max-w-none md:max-w-3xl">
              A curated collection blending heritage silhouettes with modern spirit — discover pieces made to last.
            </p>
          </div>
        </div>
      </section>

      {/* FULL-BLEED ASSET GALLERY */}
      <FullBleedGallery />
      
      {/* MEN FEATURE — product list */}
      <section className="py-8 px-0">
        <div className="max-w-screen-2xl mx-auto px-0">
          {/* specific ordered men items: 2,5,7,9,10 */}
          {(() => {
            const featuredIds = [2, 5, 7, 9, 10]
            const featured = featuredIds
              .map((id) => allProducts.find((p) => p.id === id))
              .filter(Boolean) as typeof allProducts

            return <ProductGrid title="Men — Heritage Collection" products={featured} />
          })()}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-8 px-0">
        <div className="max-w-screen-2xl mx-auto px-0">
          <ProductGrid title="Women — Grace Collection" products={womenItems} />
        </div>
      </section>
    </div>
  )
}