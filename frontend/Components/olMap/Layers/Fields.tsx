import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import { Collection } from 'ol'
import { useEffect, memo } from 'react'
import { useOlMap, useMapActions } from '@State/MapState'
import { useLiveData, useLocalData } from '@State/DataState'
import iconStyle from '@lib/iconStyle'

import type { MapCollection } from '@State/DataStateFunctions'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'
import type { WarFeaturesData } from '@State/DataTypes'
import type { Options } from 'ol/layer/BaseVector'
import type { FeatureLike } from 'ol/Feature'
import type { StyleFunction } from 'ol/style/Style'
import type { Style } from 'ol/style'

interface ExtendOptions extends Options<VectorSource> {
  title: string
  canSearch: boolean
  canToggle: boolean
  type: string
}

function assembleFieldLayer (staticCollection: MapCollection, warFeatures: WarFeaturesData): VectorLayer<VectorSource<Geometry>> {
  const field = new VectorSource({ features: new Collection<Feature<Geometry>>() })

  field.clear(true)
  field.addFeatures(staticCollection.field)

  const mapIconStyle: StyleFunction = (feature: FeatureLike, resolution: number): Style | Style[] => iconStyle(feature, resolution, warFeatures)

  const options: ExtendOptions = {
    title: 'Resource field',
    canSearch: false,
    canToggle: true,
    type: 'overlay',
    source: field,
    zIndex: 1,
    maxResolution: 4,
    style: mapIconStyle,
    updateWhileAnimating: true,
    updateWhileInteracting: true
  }

  return new VectorLayer(options)
}

const Fields = memo(function Fields (): null {
  const olMap = useOlMap()
  const { applyLayer, removeLayer } = useMapActions()
  const { warFeatures } = useLocalData()
  const { mapStatic } = useLiveData()

  useEffect(() => {
    if ((olMap == null) || (mapStatic == null) || (warFeatures == null)) return undefined

    const conquestLayer = assembleFieldLayer(mapStatic, warFeatures)
    applyLayer(conquestLayer)

    return () => {
      removeLayer(conquestLayer)
    }
  }, [olMap, mapStatic, warFeatures, applyLayer, removeLayer])

  return null
})

export default Fields
