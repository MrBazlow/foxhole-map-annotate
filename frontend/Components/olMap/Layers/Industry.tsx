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
import type { FeatureLike } from 'ol/Feature'
import type { Style } from 'ol/style'
import type { StyleFunction } from 'ol/style/Style'
import type { ExtendOptions } from './types'

function assembleIndustryLayer (staticCollection: MapCollection, warFeatures: WarFeaturesData): VectorLayer<VectorSource<Geometry>> {
  const industry = new VectorSource({ features: new Collection<Feature<Geometry>>() })

  industry.clear(true)
  industry.addFeatures(staticCollection.industry)

  const mapIconStyle: StyleFunction = (feature: FeatureLike, resolution: number): Style | Style[] => iconStyle(feature, resolution, warFeatures)

  const options: ExtendOptions = {
    title: 'Industry',
    canSearch: false,
    canToggle: true,
    type: 'overlay',
    source: industry,
    zIndex: 1,
    maxResolution: 4,
    style: mapIconStyle,
    updateWhileAnimating: true,
    updateWhileInteracting: true
  }

  return new VectorLayer(options)
}

const Industry = memo(function Industry (): null {
  const olMap = useOlMap()
  const { applyLayer, removeLayer } = useMapActions()
  const { warFeatures } = useLocalData()
  const { mapStatic } = useLiveData()

  useEffect(() => {
    if ((olMap == null) || (mapStatic == null) || (warFeatures == null)) return undefined

    const industryLayer = assembleIndustryLayer(mapStatic, warFeatures)

    applyLayer(industryLayer)

    return () => {
      removeLayer(industryLayer)
    }
  }, [olMap, mapStatic, warFeatures, applyLayer, removeLayer])

  return null
})

export default Industry
