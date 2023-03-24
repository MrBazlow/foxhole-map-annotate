import React, { memo } from 'react'

const Attribution = memo(function Attribution (): JSX.Element {
  return (
    <div className="absolute bottom-0 right-0 select-none rounded-tl-md bg-zinc-300 pr-2 text-[10px] text-black">
      <a href="https://sentsu.itch.io/foxhole-better-map-mod" target="_blank" rel="noreferrer">© Sentsu</a>
      {' + '}
      <a href="https://www.foxholegame.com/" target="_blank" rel="noreferrer">Siege Camp</a>
    </div>
  )
})

export default Attribution
