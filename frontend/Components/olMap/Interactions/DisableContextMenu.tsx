import { useEffect, memo } from 'react'
import { useOlMap } from '@State/MapState'

const DisableContextMenu = memo(function DisableContextMenu (): null {
  const olMap = useOlMap()

  useEffect(() => {
    if (olMap === null) {
      return
    }
    function handleEvent (event: MouseEvent): false {
      event.preventDefault()
      return false
    }
    olMap.getTargetElement().addEventListener('contextmenu', handleEvent)
    return () => {
      olMap.getTargetElement()?.removeEventListener('contextmenu', handleEvent)
    }
  }, [olMap])
  return null
})

export default DisableContextMenu
