export default function BrandBanner() {
  return (
    <section className="w-full">
      <div className="w-full px-0 py-8 md:py-12">
        <div className="relative overflow-hidden">
          <div className="relative overflow-hidden h-56 md:h-80 lg:h-96">
            <img
              src="/images/brand-banner.jpg"
              alt="Brand"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}