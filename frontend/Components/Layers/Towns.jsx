import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Collection } from 'ol';
import { useEffect } from 'react';
import { useOlMap, useMapActions } from '../../State/MapState';
import { useLiveData, useLocalData } from '../../State/DataState';
import iconStyle from '../../lib/iconStyle';

function assembleTownsLayer(staticCollection, warFeatures) {
  const town = new VectorSource({ features: new Collection() });

  town.clear(true);
  town.addFeatures(staticCollection.town);

  const mapIconStyle = (feature, resolution) => iconStyle(feature, resolution, warFeatures);

  return new VectorLayer({
    title: 'Towns/Relics',
    canSearch: false,
    canToggle: true,
    source: town,
    zIndex: 1,
    maxResolution: 5,
    style: mapIconStyle,
    updateWhileAnimating: true,
    updateWhileInteracting: true,
  });
}

function Towns() {
  const olMap = useOlMap();
  const { applyLayer, removeLayer } = useMapActions();
  const { warFeatures } = useLocalData();
  const { mapStatic } = useLiveData();

  useEffect(() => {
    if (!olMap || !mapStatic || !warFeatures) return undefined;

    const conquestLayer = assembleTownsLayer(mapStatic, warFeatures);

    applyLayer(conquestLayer);

    return () => {
      removeLayer(conquestLayer);
    };
  }, [olMap, mapStatic, warFeatures, applyLayer, removeLayer]);

  return null;
}

export default Towns;
