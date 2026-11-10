import { TICKER } from '../config'

export default function Marquee({
  items = TICKER,
  reverse = false,
  className = '',
}: {
  items?: string[]
  reverse?: boolean
  className?: string
}) {
  const row = [...items, ...items]
  return (
    <div className={`overflow-hidden border-y border-line select-none ${className}`} aria-hidden>
      <div className={`marquee-track ${reverse ? 'reverse' : ''}`}>
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {row.map((t, i) => (
              <span key={`${k}-${i}`} className="flex items-center">
                <span className="px-6 md:px-10 py-3 micro whitespace-nowrap">{t}</span>
                <span className="text-signal text-[8px]">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
