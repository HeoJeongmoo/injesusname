import { useEffect, useState } from 'react'

function diff(target: number) {
  const ms = Math.max(target - Date.now(), 0)
  return {
    done: ms === 0,
    d: Math.floor(ms / 86400000),
    h: Math.floor(ms / 3600000) % 24,
    m: Math.floor(ms / 60000) % 60,
    s: Math.floor(ms / 1000) % 60,
  }
}

const two = (n: number) => String(n).padStart(2, '0')

export default function Countdown({ date, size = 'md' }: { date: string; size?: 'md' | 'lg' }) {
  const target = new Date(date).getTime()
  const [t, setT] = useState(() => diff(target))

  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  if (t.done) return <span className="micro text-signal">● Live now</span>

  const cells: [string, number][] = [
    ['D', t.d],
    ['H', t.h],
    ['M', t.m],
    ['S', t.s],
  ]
  const num = size === 'lg' ? 'text-6xl md:text-8xl' : 'text-3xl md:text-4xl'

  return (
    <div className="flex items-end gap-3 md:gap-5 tabular-nums">
      {cells.map(([k, v], i) => (
        <div key={k} className="flex items-end gap-3 md:gap-5">
          <div className="flex flex-col items-start">
            <span className={`font-display leading-none ${num}`}>{two(v)}</span>
            <span className="micro text-ash mt-1">{k}</span>
          </div>
          {i < cells.length - 1 && <span className={`font-display leading-none text-ash/50 ${num}`}>:</span>}
        </div>
      ))}
    </div>
  )
}
