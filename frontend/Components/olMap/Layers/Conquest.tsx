import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import { Fill, Stroke, Style } from 'ol/style'
import Collection from 'ol/Collection'
import { useEffect, memo } from 'react'
import { useOlMap, useMapActions } from '@State/MapState'
import { useLiveData, useLocalData } from '@State/DataState'

import type { MapCollection } from '@State/DataStateFunctions'
import type { Geometry } from 'ol/geom'
import type { Feature } from 'ol'
import type { Factions, Regions, WarFeaturesData } from '@State/DataTypes'
import type { Options } from 'ol/layer/BaseVector'
import type { FeatureLike } from 'ol/Feature'
import type { StyleFunction } from 'ol/style/Style'

interface ExtendOptions extends Options<VectorSource> {
  title: string
  canSearch: boolean
  canToggle: boolean
  type: string
}

function assembleConquestLayer (staticCollection: MapCollection, warFeatures: WarFeaturesData): VectorLayer<VectorSource<Geometry>> {
  const voronoi = new VectorSource({ features: new Collection<Feature<Geometry>>() })

  voronoi.clear(true)
  voronoi.addFeatures(staticCollection.voronoi)

  const conquestTeamStyles = {
    '': new Style({
      fill: new Fill({
        color: '#FFFFFF00'
      }),
      stroke: new Stroke({
        color: '#00000011',
        width: 1
      })
    }),
    Warden: new Style({
      fill: new Fill({
        color: '#24568244'
      }),
      stroke: new Stroke({
        color: '#24568222',
        width: 1
      })
    }),
    Colonial: new Style({
      fill: new Fill({
        color: '#516C4B44'
      }),
      stroke: new Stroke({
        color: '#516C4B22',
        width: 1
      })
    }),
    Nuked: new Style({
      fill: new Fill({
        color: '#C0000044'
      }),
      stroke: new Stroke({
        color: '#C0000022',
        width: 1
      })
    })
  }

  const conquestStyle: StyleFunction = (feature: FeatureLike): Style => {
    const getTeam: Factions = feature.get('team')
    const team = getTeam === 'None' ? '' : getTeam
    const region: Regions = feature.get('region')

    const deactivatedRegions = warFeatures.deactivatedRegions ?? []
    if (region !== undefined && deactivatedRegions.includes(region)) {
      return new Style()
    }
    return conquestTeamStyles[team]
  }

  const options: ExtendOptions = {
    title: 'Conquest',
    canSearch: false,
    canToggle: true,
    type: 'overlay',
    source: voronoi,
    zIndex: 1,
    style: conquestStyle,
    updateWhileAnimating: true,
    updateWhileInteracting: true
  }

  return new VectorLayer(options)
}

const Conquest = memo(function Conquest (): null {
  const olMap = useOlMap()
  const { applyLayer, removeLayer } = useMapActions()
  const { warFeatures } = useLocalData()
  const { mapStatic } = useLiveData()

  useEffect(() => {
    if ((olMap == null) || (mapStatic == null) || (warFeatures == null)) return undefined

    const conquestLayer = assembleConquestLayer(mapStatic, warFeatures)

    applyLayer(conquestLayer)

    return () => {
      removeLayer(conquestLayer)
    }
  }, [olMap, mapStatic, warFeatures, applyLayer, removeLayer])
  return null
})

export default Conquest
