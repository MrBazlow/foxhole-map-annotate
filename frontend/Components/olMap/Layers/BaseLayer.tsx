import { useEffect, memo } from 'react'
import { Tile } from 'ol/layer'
import { TileImage } from 'ol/source'
import TileGrid from 'ol/tilegrid/TileGrid'
import { useOlMap, useMapActions } from '@State/MapState'
import type { Options } from 'ol/layer/BaseTile'

interface ExtendOptions extends Options<TileImage> {
  title: string
  canSearch: boolean
  canToggle: boolean
  type: string
}

function createBaseLayer (): Tile<TileImage> {
  const options: ExtendOptions = {
    title: 'Map',
    canSearch: false,
    canToggle: false,
    type: 'base',
    preload: Infinity,
    source: new TileImage({
      tileGrid: new TileGrid({
        extent: [0, -12_432, 11_279, 0],
        origin: [0, -12_432],
        resolutions: [64, 32, 16, 8, 4, 2, 1],
        tileSize: [256, 256]
      }),
      tileUrlFunction (tileCoord) {
        return '/map/{z}/{x}/{y}.webp'
          .replace('{z}', String(tileCoord[0]))
          .replace('{x}', String(tileCoord[1]))
          .replace('{y}', String(-1 - tileCoord[2]))
      }
    })
  }

  return new Tile(options)
}

const BaseLayer = memo(function BaseLayer (): null {
  const olMap = useOlMap()
  const { applyLayer, removeLayer } = useMapActions()

  useEffect(() => {
    if (olMap === null) {
      return
    }
    const baseTileLayer = createBaseLayer()
    applyLayer(baseTileLayer)
    return () => {
      removeLayer(baseTileLayer)
    }
  }, [applyLayer, olMap, removeLayer])
  return null
})

export default BaseLayer
