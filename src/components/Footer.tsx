export default function Footer() {
  return (
    <footer className="w-full mt-24 border-t border-gray-200">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          {/* 브랜드 */}
          <div>
            <p className="font-bebas text-2xl tracking-wide">INJESUSNAME</p>
            <p className="text-sm opacity-50 mt-2">
              Whatever you do, #injesusname
            </p>
          </div>

          {/* 링크 */}
          <div className="flex gap-16">
            <div>
              <h3 className="text-xs uppercase tracking-widest opacity-40 mb-4">
                Shop
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a href="/men" className="hover:opacity-50 transition-opacity">
                    Men
                  </a>
                </li>
                <li>
                  <a href="/women" className="hover:opacity-50 transition-opacity">
                    Women
                  </a>
                </li>
                <li>
                  <a href="/unisex" className="hover:opacity-50 transition-opacity">
                    Unisex
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest opacity-40 mb-4">
                Support
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a href="/shipping" className="hover:opacity-50 transition-opacity">
                    Shipping
                  </a>
                </li>
                <li>
                  <a href="/returns" className="hover:opacity-50 transition-opacity">
                    Returns
                  </a>
                </li>
                <li>
                  <a href="/faq" className="hover:opacity-50 transition-opacity">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 하단 바 */}
        <div className="border-t border-gray-200 mt-14 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs opacity-40">
            © {new Date().getFullYear()} INJESUSNAME. All rights reserved.
          </p>
          <p className="text-xs opacity-40 uppercase tracking-widest">
            Seoul, South Korea
          </p>
        </div>
      </div>
    </footer>
  )
}
