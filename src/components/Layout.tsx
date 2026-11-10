import type { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import CartDrawer from './CartDrawer'
import ScrollToTop from './ScrollToTop'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="grain flex flex-col min-h-screen">
      <ScrollToTop />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
