import React, { useEffect, memo } from 'react'
import { useLiveData, useDataActions } from '@State/DataState'

const Layers = memo(function Layers ({ children }: { children: React.ReactNode }): JSX.Element {
  const { mapStatic } = useLiveData()
  const { readStatic } = useDataActions()

  useEffect(() => {
    if (mapStatic !== null) {
      return
    }

    void readStatic()
  }, [readStatic, mapStatic])

  return (
    <>
      {children}
    </>
  )
})

export default Layers
