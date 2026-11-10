import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import IntroOverlay from '../components/IntroOverlay'
import Marquee from '../components/Marquee'
import Countdown from '../components/Countdown'
import ProductGrid from '../components/ProductGrid'
import Reveal from '../components/Reveal'
import RecOverlay from '../components/RecOverlay'
import { products } from '../data/products'
import { lookbook } from '../data/lookbook'
import { BRAND, DROP } from '../config'
import { pad, won } from '../lib/format'
import type { Category } from '../types/product'

export default function Home() {
  return (
    <div>
      <IntroOverlay />
      <Hero />
      <Marquee />
      <DropFeature />
      <Manifesto />
      <Lookbook />
      <Collection />
    </div>
  )
}

/* ───────────────────────── HERO ───────────────────────── */
function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[620px] overflow-hidden">
      <motion.video
        style={{ y: videoY }}
        className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 brightness-[0.55]"
        src="/videos/visual.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent to-ink" />
      {/* 스캔라인 + 비네팅 — 모니터로 녹화 화면을 보는 질감 */}
      <div aria-hidden className="absolute inset-0 scanlines" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55)_100%)]" />

      {/* center lockup — 티셔츠 등판 그래픽을 그대로 옮긴 구성 */}
      <motion.div style={{ y: titleY, opacity: fade }} className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <div className="relative flex items-center justify-center w-full">
          <motion.span
            aria-hidden
            className="absolute font-display text-outline text-[38vw] md:text-[30vw] leading-none select-none"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
          >
            JESUS
          </motion.span>
          <motion.h1
            className="relative font-display text-outline-strong text-[13.5vw] md:text-[11vw] leading-none tracking-[0.01em]"
            initial={{ opacity: 0, filter: 'blur(16px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            INJESUSNAME
          </motion.h1>
        </div>
        <motion.p
          className="micro mt-4 md:mt-6 tracking-[0.4em]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {DROP.title}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <Link to="/product/1" className="btn btn-solid">
            Shop {DROP.code}
          </Link>
          <a href="#waitlist" className="btn btn-ghost backdrop-blur-sm">
            Get notified
          </a>
        </motion.div>
      </motion.div>

      <RecOverlay />
    </section>
  )
}

/* ───────────────────────── DROP FEATURE ───────────────────────── */
function DropFeature() {
  const hero = products[0]
  const [view, setView] = useState<'back' | 'front'>('back')

  return (
    <section className="grid lg:grid-cols-2 border-b border-line">
      {/* image */}
      <div className="relative bg-black aspect-square lg:aspect-auto lg:min-h-[100svh] flex items-center justify-center overflow-hidden lg:border-r border-line">
        <motion.img
          key={view}
          src={view === 'back' ? hero.image : hero.hoverImage}
          alt={`${hero.name} ${view}`}
          className="w-[86%] max-w-[760px] object-contain mix-blend-lighten"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        />
        <div className="absolute top-5 left-5 micro text-ash">Fig. {pad(hero.id)}</div>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex border border-line">
          {(['back', 'front'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`micro px-5 py-2.5 transition-colors ${view === v ? 'bg-bone text-ink' : 'text-ash hover:text-bone'}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* info */}
      <div className="px-5 md:px-12 py-16 md:py-24 flex flex-col justify-between gap-16">
        <Reveal>
          <p className="micro text-signal">● {DROP.code} — Coming soon</p>
          <h2 className="mt-6 text-[18vw] lg:text-[9vw] leading-[0.82]">
            CON
            <br />
            QUER
            <br />
            ORS<span className="text-signal">.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="space-y-10">
          <p className="text-base md:text-lg leading-relaxed text-bone/80 max-w-md">{hero.description}</p>

          <dl className="grid grid-cols-2 border-t border-line">
            {[
              ['Item', hero.name],
              ['Price', won(hero.price)],
              ['Back', 'INJESUSNAME / JESUS'],
              ['Hem', 'ROMANS 8:37 · 1 JOHN 5:4'],
            ].map(([k, v]) => (
              <div key={k} className="py-4 border-b border-line odd:pr-4">
                <dt className="micro text-ash">{k}</dt>
                <dd className="micro mt-1.5">{v}</dd>
              </div>
            ))}
          </dl>

          <div>
            <p className="micro text-ash mb-4">Drop opens in</p>
            <Countdown date={DROP.date} />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={`/product/${hero.id}`} className="btn btn-solid">
              View product
            </Link>
            <a href="#waitlist" className="btn btn-ghost">
              Notify me
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────────────────────── MANIFESTO ───────────────────────── */
const MANIFESTO = 'WHATEVER YOU DO, DO IT IN THE NAME OF JESUS.'

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1])
  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.22em]">
      {children}
    </motion.span>
  )
}

function Manifesto() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = MANIFESTO.split(' ')

  return (
    <section className="px-5 md:px-8 py-32 md:py-48 border-b border-line">
      <div className="flex justify-between micro text-ash mb-10">
        <span>( Manifesto )</span>
        <span>{BRAND.verse}</span>
      </div>
      <div ref={ref}>
        <p className="font-display text-[13vw] md:text-[8.4vw] leading-[0.9]">
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {w}
            </Word>
          ))}
        </p>
      </div>
      <div className="mt-14 grid md:grid-cols-3 gap-8">
        <p className="micro text-ash">{BRAND.taglineKo}</p>
        <p className="md:col-span-2 text-bone/70 leading-relaxed max-w-xl">
          INJESUSNAME은 일상의 옷 위에 믿음을 새깁니다. 소리치지 않지만 분명하게, 어두운 거리에서도 선명하게. 우리가 입는 모든 것이 하나의 고백이 되도록.
        </p>
      </div>
    </section>
  )
}

/* ───────────────────────── LOOKBOOK (pinned horizontal) ───────────────────────── */
function Lookbook() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-72%'])

  if (lookbook.length === 0) return null

  return (
    <section ref={ref} id="lookbook" className="relative h-[320vh] border-b border-line">
      <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col">
        <div className="flex items-end justify-between px-5 md:px-8 pt-24 pb-6">
          <h2 className="text-6xl md:text-8xl leading-none">LOOKBOOK</h2>
          <span className="hidden sm:inline micro text-ash">
            {DROP.code} / {pad(lookbook.length, 2)} looks
          </span>
        </div>
        <motion.div style={{ x }} className="flex gap-3 md:gap-5 px-5 md:px-8 flex-1 pb-10 items-center md:items-stretch w-max">
          {lookbook.map((src, i) => (
            <figure key={src} className={`group relative h-[58svh] md:h-full ${i % 3 === 1 ? 'pt-[8vh]' : i % 3 === 2 ? 'pb-[8vh]' : ''}`}>
              <div className="h-full aspect-[3/4] overflow-hidden bg-ink-3">
                <img
                  src={src}
                  alt={`Look ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover grayscale contrast-110 brightness-90 transition-all duration-700 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-[1.03]"
                />
              </div>
              <figcaption className="absolute left-0 -bottom-0 translate-y-full pt-2 micro text-ash">
                Look {pad(i + 1, 2)}
              </figcaption>
            </figure>
          ))}
          <div className="h-[58svh] md:h-full aspect-[3/4] flex flex-col justify-center items-start gap-6 px-6 border border-line">
            <p className="font-display text-5xl leading-none">
              WEAR
              <br />
              THE
              <br />
              WORD.
            </p>
            <Link to="/shop" className="btn btn-ghost">
              Shop all →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ───────────────────────── COLLECTION ───────────────────────── */
const FILTERS: (Category | 'all')[] = ['all', 'men', 'women', 'unisex']

function Collection() {
  const [f, setF] = useState<Category | 'all'>('all')
  const list = useMemo(() => (f === 'all' ? products : products.filter((p) => p.category === f)).slice(0, 8), [f])

  return (
    <section className="pt-28">
      <div className="px-5 md:px-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="micro text-ash">( The collection )</p>
          <h2 className="mt-3 text-6xl md:text-8xl leading-none">ESSENTIALS</h2>
        </div>
        <div className="flex gap-5">
          {FILTERS.map((k) => (
            <button
              key={k}
              onClick={() => setF(k)}
              className={`micro link-line ${f === k ? 'active text-bone' : 'text-ash hover:text-bone'}`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
      <ProductGrid products={list} />
      <div className="flex justify-center mt-12">
        <Link to="/shop" className="btn btn-ghost">
          View all products ({products.length})
        </Link>
      </div>
    </section>
  )
}
