import './Labels.css'
import { useEffect, memo } from 'react'
import { Vector as VectorSource } from 'ol/source'
import { Group, Vector as VectorLayer } from 'ol/layer'
import { Collection } from 'ol'
import { Fill, Stroke, Style, Text } from 'ol/style'
import { useOlMap, useMapActions } from '@State/MapState'
import { useLiveData, useLocalData } from '@State/DataState'
import { regionsSchema } from '@State/DataTypes'

import type { MapCollection } from '@State/DataStateFunctions'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'
import type { WarFeaturesData } from '@State/DataTypes'
import type { FeatureLike } from 'ol/Feature'
import type { StyleFunction } from 'ol/style/Style'
import type { ExtendOptions, GroupExtendOptions } from './types'

function assembleLabelLayers (staticCollection: MapCollection, warFeatures: WarFeaturesData): Group {
  const groupOption: GroupExtendOptions = { title: 'Labels' }
  const labelsLayerGroup = new Group(groupOption)

  const labelSources = {
    Region: new VectorSource({ features: new Collection<Feature<Geometry>>() }),
    Major: new VectorSource({ features: new Collection<Feature<Geometry>>() }),
    Minor: new VectorSource({ features: new Collection<Feature<Geometry>>() })
  }

  const regionLabelStyle = new Style({
    text: new Text({
      font: "1.2rem 'Jost', sans-serif",
      text: '',
      stroke: new Stroke({
        color: '#000000',
        width: 2
      }),
      overflow: true,
      fill: new Fill({
        color: '#ffffff'
      })
    })
  })

  const majorLabelStyle = new Style({
    text: new Text({
      font: "1rem 'Jost', sans-serif",
      text: '',
      stroke: new Stroke({
        color: '#000000',
        width: 2
      }),
      overflow: true,
      fill: new Fill({
        color: '#ffffff'
      })
    })
  })

  const deactivatedRegions = warFeatures.deactivatedRegions ?? []

  const regionStyle: StyleFunction = (feature: FeatureLike): Style => {
    const featureRegion = regionsSchema.parse(feature.getId())

    if (deactivatedRegions.includes(featureRegion)) {
      majorLabelStyle.getText().setText('')
      return majorLabelStyle
    }

    regionLabelStyle.getText().setText(feature.get('notes'))
    return regionLabelStyle
  }

  const majorStyle: StyleFunction = (feature: FeatureLike): Style => {
    const featureRegion = regionsSchema.parse(feature.get('region'))

    if (deactivatedRegions.includes(featureRegion)) {
      majorLabelStyle.getText().setText('')
      return majorLabelStyle
    }

    majorLabelStyle.getText().setText(feature.get('notes'))
    return majorLabelStyle
  }

  const regionLabelOptions: ExtendOptions = {
    title: 'Regions',
    canSearch: true,
    canToggle: true,
    type: 'overlay',
    source: labelSources.Region,
    zIndex: 100,
    minResolution: 4,
    style: regionStyle,
    updateWhileAnimating: true,
    updateWhileInteracting: true
  }

  const majorLabelOptions: ExtendOptions = {
    title: 'Major Labels',
    canSearch: true,
    canToggle: true,
    type: 'overlay',
    source: labelSources.Major,
    zIndex: 100,
    maxResolution: 4,
    style: majorStyle,
    updateWhileAnimating: true,
    updateWhileInteracting: true
  }

  const minorLabelOptions: ExtendOptions = {
    title: 'Minor Labels',
    canSearch: true,
    canToggle: true,
    type: 'overlay',
    source: labelSources.Minor,
    zIndex: 99,
    maxResolution: 1.5,
    style: majorStyle,
    updateWhileAnimating: true,
    updateWhileInteracting: true
  }

  const regionLabelLayer = new VectorLayer(regionLabelOptions)

  const majorLabelLayer = new VectorLayer(majorLabelOptions)

  const minorLabelLayer = new VectorLayer(minorLabelOptions)

  const keySet = Object.keys(labelSources) as Array<keyof typeof labelSources>

  keySet.forEach((key) => {
    labelSources[key].clear(true)
    labelSources[key].addFeatures(staticCollection[key])
  })

  labelsLayerGroup.getLayers().clear()
  labelsLayerGroup.getLayers().push(regionLabelLayer)
  labelsLayerGroup.getLayers().push(majorLabelLayer)
  labelsLayerGroup.getLayers().push(minorLabelLayer)

  return labelsLayerGroup
}

const Labels = memo(function Labels (): null {
  const olMap = useOlMap()
  const { applyLayer, removeLayer } = useMapActions()
  const { warFeatures } = useLocalData()
  const { mapStatic } = useLiveData()

  useEffect(() => {
    if ((olMap == null) || (mapStatic == null) || (warFeatures == null)) return undefined

    const layerGroup = assembleLabelLayers(mapStatic, warFeatures)
    applyLayer(layerGroup)

    return () => {
      removeLayer(layerGroup)
    }
  }, [olMap, mapStatic, applyLayer, removeLayer, warFeatures])

  return null
})

export default Labels
