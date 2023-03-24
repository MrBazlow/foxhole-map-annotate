import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import { Collection } from 'ol'
import { useEffect } from 'react'
import { useOlMap, useMapActions } from '@State/MapState'
import { useLiveData, useLocalData } from '@State/DataState'
import iconStyle from '@lib/iconStyle'

import type { MapCollection } from '@State/DataStateFunctions'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'
import type { WarFeaturesData } from '@State/DataTypes'
import type { FeatureLike } from 'ol/Feature'
import type { Style } from 'ol/style'
import type { StyleFunction } from 'ol/style/Style'
import type { ExtendOptions } from './types'

function assembleTownsLayer (staticCollection: MapCollection, warFeatures: WarFeaturesData): VectorLayer<VectorSource<Geometry>> {
  const town = new VectorSource({ features: new Collection<Feature<Geometry>>() })

  town.clear(true)
  town.addFeatures(staticCollection.town)

  const mapIconStyle: StyleFunction = (feature: FeatureLike, resolution: number): Style | Style[] => iconStyle(feature, resolution, warFeatures)

  const options: ExtendOptions = {
    title: 'Towns/Relics',
    canSearch: false,
    canToggle: true,
    type: 'overlay',
    source: town,
    zIndex: 1,
    maxResolution: 5,
    style: mapIconStyle,
    updateWhileAnimating: true,
    updateWhileInteracting: true
  }

  return new VectorLayer(options)
}

function Towns (): null {
  const olMap = useOlMap()
  const { applyLayer, removeLayer } = useMapActions()
  const { warFeatures } = useLocalData()
  const { mapStatic } = useLiveData()

  useEffect(() => {
    if ((olMap == null) || (mapStatic == null) || (warFeatures == null)) return undefined

    const conquestLayer = assembleTownsLayer(mapStatic, warFeatures)

    applyLayer(conquestLayer)

    return () => {
      removeLayer(conquestLayer)
    }
  }, [olMap, mapStatic, warFeatures, applyLayer, removeLayer])

  return null
}

export default Towns
