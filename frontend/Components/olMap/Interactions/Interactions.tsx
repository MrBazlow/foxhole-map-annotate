import React, { memo } from 'react'

const Interactions = memo(function Interactions ({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <>
      {children}
    </>
  )
})

export default Interactions
