import './Labels.css';
import { useEffect } from 'react';
import { Vector as VectorSource } from 'ol/source';
import { Group, Vector as VectorLayer } from 'ol/layer';
import { Collection } from 'ol';
import {
  Fill, Stroke, Style, Text,
} from 'ol/style';
import { useOlMap, useMapActions } from '../../State/MapState';
import { useLiveData } from '../../State/DataState';

function assembleLabelLayers(staticCollection) {
  const labelsLayerGroup = new Group({ title: 'Labels' });

  const labelSources = {
    Region: new VectorSource({ features: new Collection() }),
    Major: new VectorSource({ features: new Collection() }),
    Minor: new VectorSource({ features: new Collection() }),
  };

  const regionLabelStyle = new Style({
    text: new Text({
      font: "1.2rem 'Jost', sans-serif",
      text: '',
      stroke: new Stroke({
        color: '#000000',
        width: 2,
      }),
      //overflow: true,
      fill: new Fill({
        color: '#ffffff',
      }),
    }),
  });

  const majorLabelStyle = new Style({
    text: new Text({
      font: "1rem 'Jost', sans-serif",
      text: '',
      stroke: new Stroke({
        color: '#000000',
        width: 2,
      }),
      //overflow: true,
      fill: new Fill({
        color: '#ffffff',
      }),
    }),
  });

  const regionStyle = (feature) => {
    regionLabelStyle.getText().setText(feature.get('notes'));
    return regionLabelStyle;
  };

  const majorStyle = (feature) => {
    majorLabelStyle.getText().setText(feature.get('notes'));
    return majorLabelStyle;
  };

  const regionLabelLayer = new VectorLayer({
    title: 'Regions',
    canSearch: true,
    canToggle: true,
    source: labelSources.Region,
    zIndex: 100,
    minResolution: 4,
    style: regionStyle,
    updateWhileAnimating: true,
    updateWhileInteracting: true,
  });

  const majorLabelLayer = new VectorLayer({
    title: 'Major Labels',
    canSearch: true,
    canToggle: true,
    source: labelSources.Major,
    zIndex: 100,
    maxResolution: 4,
    style: majorStyle,
    updateWhileAnimating: true,
    updateWhileInteracting: true,
  });

  const minorLabelLayer = new VectorLayer({
    title: 'Minor Labels',
    canSearch: true,
    canToggle: true,
    source: labelSources.Minor,
    zIndex: 99,
    maxResolution: 1.5,
    style: majorStyle,
    updateWhileAnimating: true,
    updateWhileInteracting: true,
  });

  Object.keys(labelSources).forEach((key) => {
    labelSources[key].clear(true);
    labelSources[key].addFeatures(staticCollection[key]);
  });

  labelsLayerGroup.getLayers().clear();
  labelsLayerGroup.getLayers().push(regionLabelLayer);
  labelsLayerGroup.getLayers().push(majorLabelLayer);
  labelsLayerGroup.getLayers().push(minorLabelLayer);

  return labelsLayerGroup;
}

function Labels() {
  const olMap = useOlMap();
  const { applyLayer, removeLayer } = useMapActions();
  const { mapStatic } = useLiveData();

  useEffect(() => {
    if (!olMap || !mapStatic) return undefined;

    const layerGroup = assembleLabelLayers(mapStatic);
    applyLayer(layerGroup);

    return (() => {
      removeLayer(layerGroup);
    });
  }, [olMap, mapStatic]);

  return null;
}

export default Labels;
