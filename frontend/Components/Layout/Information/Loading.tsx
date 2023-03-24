import React, { memo } from 'react'
import { motion } from 'framer-motion'

const Loading = memo(() => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="absolute inset-0 -z-10 flex h-screen w-screen items-center justify-center overflow-hidden"
  >
    <motion.img
      initial={{ x: 0, y: 0 }}
      animate={{ x: 100, y: 0 }}
      src="/images/favicon.svg"
      className="h-1/3 flex-none animate-clock"
      alt="Logo"
    />
  </motion.div>
))

Loading.displayName = 'Loading'

export default Loading
