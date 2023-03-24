import { useEffect, memo } from 'react'
import { DragPan } from 'ol/interaction'
import { useOlMap } from '@State/MapState'
import type { MapBrowserEvent } from 'ol'

const MiddleMousePan = memo(function MiddleMousePan (): null {
  const olMap = useOlMap()

  useEffect(() => {
    if (olMap === null) {
      return
    }
    function primaryPrimaryOrMiddle (mapBrowserEvent: MapBrowserEvent<PointerEvent>): boolean {
      const pointerEvent = mapBrowserEvent.originalEvent
      return pointerEvent.isPrimary && (pointerEvent.button === 0 || pointerEvent.button === 1)
    }
    const middleDrag = new DragPan({ condition: primaryPrimaryOrMiddle })
    olMap.addInteraction(middleDrag)
    return () => {
      olMap.removeInteraction(middleDrag)
    }
  }, [olMap])
  return null
})

export default MiddleMousePan
