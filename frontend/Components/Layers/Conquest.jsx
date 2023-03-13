import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Collection } from 'ol';
import { Fill, Stroke, Style } from 'ol/style';
import { useEffect } from 'react';
import { useOlMap, useMapActions } from '../../State/MapState';
import { useLiveData, useLocalData } from '../../State/DataState';

function assembleConquestLayer(staticCollection, warFeatures) {
  const voronoi = new VectorSource({ features: new Collection() });

  voronoi.clear(true);
  voronoi.addFeatures(staticCollection.voronoi);

  const conquestTeamStyles = {
    '': new Style({
      fill: new Fill({
        color: '#FFFFFF00',
      }),
      stroke: new Stroke({
        color: '#00000011',
        width: 1,
      }),
    }),
    Warden: new Style({
      fill: new Fill({
        color: '#24568244',
      }),
      stroke: new Stroke({
        color: '#24568222',
        width: 1,
      }),
    }),
    Colonial: new Style({
      fill: new Fill({
        color: '#516C4B44',
      }),
      stroke: new Stroke({
        color: '#516C4B22',
        width: 1,
      }),
    }),
    Nuked: new Style({
      fill: new Fill({
        color: '#C0000044',
      }),
      stroke: new Stroke({
        color: '#C0000022',
        width: 1,
      }),
    }),
  };

  const conquestStyle = (feature) => {
    let team = feature.get('team') ?? '';
    const region = feature.get('region');

    if (team === 'none') {
      team = '';
    }

    const { deactivatedRegions } = warFeatures;
    if (region && deactivatedRegions.includes(region)) {
      return null;
    }
    return conquestTeamStyles[team];
  };

  const conquestLayer = new VectorLayer({
    title: 'Conquest',
    canSearch: false,
    canToggle: true,
    source: voronoi,
    zIndex: 1,
    style: conquestStyle,
    updateWhileAnimating: true,
    updateWhileInteracting: true,
  });

  return conquestLayer;
}

function Conquest() {
  const olMap = useOlMap();
  const { applyLayer, removeLayer } = useMapActions();
  const { warFeatures } = useLocalData();
  const { mapStatic } = useLiveData();

  useEffect(() => {
    if (!olMap || !mapStatic || !warFeatures) return undefined;

    const conquestLayer = assembleConquestLayer(mapStatic, warFeatures);
    applyLayer(conquestLayer);

    return () => {
      removeLayer(conquestLayer);
    };
  }, [olMap, mapStatic, warFeatures, applyLayer, removeLayer]);
  return null;
}

export default Conquest;
