import React, { useRef, useEffect, memo } from 'react'
import { Map, View } from 'ol'
import { defaults as controlDefaults } from 'ol/control'
import { defaults as interactionDefaults } from 'ol/interaction'
import { useMapActions } from '../../State/MapState'

function baseMap (): Map {
  const url = new URL(window.location.href)
  function getFromUrl (value: string): number | undefined {
    const query = url.searchParams.get(value)
    if (query === null) {
      return
    }
    return parseFloat(query)
  }

  return new Map({
    interactions: interactionDefaults({ dragPan: false }),
    controls: controlDefaults({
      zoom: false,
      rotate: false
    }),
    view: new View({
      center: [
        getFromUrl('cx') ?? 5625.5,
        getFromUrl('cy') ?? -6216
      ],
      resolution: getFromUrl('r') ?? 10.0,
      minResolution: 0.5,
      maxResolution: 16
    })
  })
}

const OlMap = memo(function OlMap ({ children }: { children: React.ReactNode }): JSX.Element {
  const mapNode = useRef(null)
  const { setMap, removeMap } = useMapActions()

  useEffect(() => {
    if (mapNode.current === null) {
      return
    }
    const olMap = baseMap()
    olMap.setTarget(mapNode.current)
    setMap(olMap)
    return () => {
      removeMap()
    }
  }, [removeMap, setMap])

  return (
    <div ref={mapNode} className="h-full w-full flex-none">{children}</div>
  )
})

export default OlMap
