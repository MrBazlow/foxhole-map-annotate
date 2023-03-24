import React, { useState, useEffect, useCallback } from 'react'
// import { Vector as VectorLayer } from 'ol/layer'
import { Popover } from '@headlessui/react'
import { useOlMap } from '@State/MapState'
import MapLayer from './MapLayer'
import type { Layer } from 'ol/layer'
import type { Source } from 'ol/source'
import type LayerRenderer from 'ol/renderer/Layer'

function MapConfig (): JSX.Element {
  const olMap = useOlMap()
  const [toggle, setToggle] = useState(false)
  const [layers, setLayers] = useState<Array<Layer<Source, LayerRenderer<any>>>>()

  const fetchLayers = useCallback(() => {
    if (olMap === null) {
      return null
    }
    setLayers(olMap.getAllLayers().filter((layer) => layer.get('canToggle')))
  }, [olMap])

  useEffect(() => {
    if (olMap === null || !toggle) {
      return
    }
    fetchLayers()
  }, [fetchLayers, olMap, toggle])

  const layerElements: JSX.Element[] = layers !== undefined
    ? layers.map((layer) => (
    <div
      key={crypto.randomUUID()}
      className=""
    >
      <MapLayer layer={layer} />
    </div>
    ))
    : []

  return (
    <Popover className="relative">
      <Popover.Button
        onClick={() => { setToggle(!toggle) }}
        aria-label="Map Layers"
        className="group mx-2 hidden rounded-lg bg-transparent p-2 text-white transition duration-200 hover:bg-warden-600 focus:outline-none focus:ring-2 focus:ring-warden-500 active:scale-95 aria-expanded:bg-warden-600 md:inline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-6 w-6 transition duration-200 group-hover:scale-125"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
          />
        </svg>
      </Popover.Button>
      <Popover.Panel
        className="absolute right-0 mt-4 w-fit origin-top-right divide-y divide-zinc-500 overflow-hidden rounded-lg bg-zinc-800 shadow-lg"
      >
        {layerElements}
      </Popover.Panel>
    </Popover>
  )
}

export default MapConfig
