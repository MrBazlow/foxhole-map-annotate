import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Collection } from 'ol';
import { useEffect } from 'react';
import { useOlMap, useMapActions } from '../../State/MapState';
import { useLiveData, useLocalData } from '../../State/DataState';
import iconStyle from '../../lib/iconStyle';

function assembleFieldLayer(staticCollection, warFeatures) {
  const field = new VectorSource({ features: new Collection() });

  field.clear(true);
  field.addFeatures(staticCollection.field);

  const mapIconStyle = (feature, resolution) => iconStyle(feature, resolution, warFeatures);

  return new VectorLayer({
    title: 'Resource field',
    canSearch: false,
    canToggle: true,
    source: field,
    zIndex: 1,
    maxResolution: 4,
    style: mapIconStyle,
    updateWhileAnimating: true,
    updateWhileInteracting: true,
  });
}

function Fields() {
  const olMap = useOlMap();
  const { applyLayer, removeLayer } = useMapActions();
  const { warFeatures } = useLocalData();
  const { mapStatic } = useLiveData();

  useEffect(() => {
    if (!olMap || !mapStatic || !warFeatures) return undefined;

    const conquestLayer = assembleFieldLayer(mapStatic, warFeatures);

    applyLayer(conquestLayer);

    return () => {
      removeLayer(conquestLayer);
    };
  }, [olMap, mapStatic, warFeatures, applyLayer, removeLayer]);

  return null;
}

export default Fields;
