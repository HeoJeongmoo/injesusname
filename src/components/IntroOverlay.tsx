import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function IntroOverlay() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 2200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-2xl"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <motion.h1
            className="font-bebas text-white text-5xl md:text-7xl tracking-wider"
            initial={{ opacity: 0, scale: 1.3, filter: 'blur(12px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            injesusname
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  )
}