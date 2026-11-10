import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { won } from '../lib/format'

export default function Cart() {
  const { lines, subtotal, setQty, remove, count } = useCart()

  return (
    <section className="pt-16">
      <div className="px-5 md:px-8 pt-16 md:pt-24 pb-10 border-b border-line">
        <h1 className="text-7xl md:text-[10vw] leading-[0.85]">
          BAG<sup className="micro text-ash align-top ml-2">({count})</sup>
        </h1>
      </div>

      {lines.length === 0 ? (
        <div className="px-5 md:px-8 py-32 flex flex-col items-center gap-6 text-center">
          <p className="font-display text-7xl text-outline">EMPTY</p>
          <p className="text-ash">장바구니가 비어 있습니다.</p>
          <Link to="/shop" className="btn btn-ghost">Continue shopping</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_420px]">
          <ul className="divide-y divide-line lg:border-r border-line">
            {lines.map((l) => (
              <li key={`${l.id}-${l.size}`} className="flex gap-5 md:gap-8 p-5 md:p-8">
                <Link to={`/product/${l.id}`} className="w-28 md:w-40 aspect-[4/5] bg-ink-2 shrink-0 flex items-center justify-center">
                  <img src={l.product.image} alt={l.product.name} className="w-full h-full object-contain p-3 mix-blend-lighten" />
                </Link>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="font-display text-2xl md:text-4xl uppercase leading-none">{l.product.name}</p>
                      <p className="micro text-ash mt-2">Size {l.size} · {won(l.product.price)}</p>
                    </div>
                    <p className="micro whitespace-nowrap">{won(l.product.price * l.qty)}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-6">
                    <div className="flex items-center border border-line">
                      <button className="w-10 h-10 micro" onClick={() => setQty(l.id, l.size, l.qty - 1)} aria-label="수량 감소">−</button>
                      <span className="w-10 text-center micro">{l.qty}</span>
                      <button className="w-10 h-10 micro" onClick={() => setQty(l.id, l.size, l.qty + 1)} aria-label="수량 증가">+</button>
                    </div>
                    <button onClick={() => remove(l.id, l.size)} className="micro text-ash link-line hover:text-bone">Remove</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="p-5 md:p-8">
            <div className="lg:sticky lg:top-24 space-y-5">
              <p className="micro text-ash">Order summary</p>
              <div className="flex justify-between micro"><span className="text-ash">Subtotal</span><span>{won(subtotal)}</span></div>
              <div className="flex justify-between micro"><span className="text-ash">Shipping</span><span>결제 시 계산</span></div>
              <div className="flex justify-between border-t border-line pt-5">
                <span className="font-display text-3xl">TOTAL</span>
                <span className="font-display text-3xl">{won(subtotal)}</span>
              </div>
              <button disabled className="btn btn-solid w-full">Checkout — opening soon</button>
              <p className="micro text-ash text-center">결제는 런칭과 함께 오픈됩니다</p>
            </div>
          </aside>
        </div>
      )}
    </section>
  )
}
