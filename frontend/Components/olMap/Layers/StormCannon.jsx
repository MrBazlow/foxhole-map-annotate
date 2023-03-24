import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import { Collection } from 'ol'
import { useEffect } from 'react'
import { useOlMap, useMapActions } from '@State/MapState'
import { useLiveData, useLocalData } from '@State/DataState'
import iconStyle from '@lib/iconStyle'

function assembleStormCannonLayer (staticCollection, warFeatures) {
  const stormCannon = new VectorSource({ features: new Collection() })

  stormCannon.clear(true)
  stormCannon.addFeatures(staticCollection.field)

  const mapIconStyle = (feature, resolution) => iconStyle(feature, resolution, warFeatures)

  return new VectorLayer({
    title: 'Storm Cannons & Intel Centres',
    canSearch: false,
    canToggle: true,
    source: stormCannon,
    zIndex: 1,
    maxResolution: 6,
    style: mapIconStyle,
    updateWhileAnimating: true,
    updateWhileInteracting: true
  })
}

function StormCannon () {
  const olMap = useOlMap()
  const { applyLayer, removeLayer } = useMapActions()
  const { warFeatures } = useLocalData()
  const { mapStatic } = useLiveData()

  useEffect(() => {
    if (!olMap || !mapStatic || !warFeatures) return undefined

    const conquestLayer = assembleStormCannonLayer(mapStatic, warFeatures)

    applyLayer(conquestLayer)

    return () => {
      removeLayer(conquestLayer)
    }
  }, [olMap, mapStatic, warFeatures, applyLayer, removeLayer])

  return null
}

export default StormCannon
