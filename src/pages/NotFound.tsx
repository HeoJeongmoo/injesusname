import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="min-h-[80svh] pt-16 flex flex-col items-center justify-center gap-8 px-5 text-center">
      <p className="font-display text-outline text-[40vw] md:text-[26vw] leading-none">404</p>
      <p className="micro text-ash">Lost, but not forgotten — Luke 15:4</p>
      <Link to="/" className="btn btn-ghost">Back home</Link>
    </section>
  )
}
