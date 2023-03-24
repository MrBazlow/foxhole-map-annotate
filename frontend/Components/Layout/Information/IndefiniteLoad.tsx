import React, { memo } from 'react'

const IndefiniteLoad = memo(() => (
  <div className="relative h-[6px] w-full overflow-hidden bg-zinc-700">
    <div className="absolute inset-y-0 w-1/2 animate-load bg-warden-700" />
  </div>
))

IndefiniteLoad.displayName = 'IndefiniteLoad'

export default IndefiniteLoad
