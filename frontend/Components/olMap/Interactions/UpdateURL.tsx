import { useEffect, memo } from 'react'
import { useOlMap } from '@State/MapState'
import type { MapEvent } from 'ol'

const UpdateURL = memo(function UpdateURL (): null {
  const olMap = useOlMap()

  useEffect(() => {
    if (olMap === null) {
      return
    }
    function handleMove (event: MapEvent): void {
      const center = event.map.getView().getCenter()
      const url = new URL(window.location.href)
      let cx = '5625.5'
      let cy = '-6216.0'
      let r = '10'
      if (center !== undefined) {
        cx = center[0].toFixed(5)
        cy = center[1].toFixed(5)
      }
      const resolution = event.map.getView().getResolution()
      if (resolution !== undefined) {
        r = resolution.toFixed(5)
      }
      url.searchParams.set('cx', cx)
      url.searchParams.set('cy', cy)
      url.searchParams.set('r', r)
      window.history.replaceState({}, '', url)
    }
    olMap.on('moveend', handleMove)
    return () => {
      olMap.un('moveend', handleMove)
    }
  }, [olMap])
  return null
})

export default UpdateURL
