import { motion, type HTMLMotionProps } from 'framer-motion'

// 스크롤 진입 시 아래에서 떠오르는 기본 애니메이션
export default function Reveal({ delay = 0, y = 30, ...rest }: HTMLMotionProps<'div'> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.2, 0.7, 0.2, 1] }}
      {...rest}
    />
  )
}
