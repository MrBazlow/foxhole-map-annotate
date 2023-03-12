import './ImmutableLayers.css';
import { useEffect } from 'react';
import { Vector as VectorSource } from 'ol/source';
import { Group, Vector as VectorLayer } from 'ol/layer';
import { Collection } from 'ol';
import {
  Fill, Stroke, Style, Text,
} from 'ol/style';
import { useOlMap, useMapActions } from '../../State/MapState';
import { useLocalData } from '../../State/DataState';
import regionParser from '../../lib/regionParser';

const LABELS_LAYER_GROUP = new Group({ title: 'Labels' });

const IMMUTABLE_SOURCES = {
  Region: new VectorSource({ features: new Collection() }),
  Major: new VectorSource({ features: new Collection() }),
  Minor: new VectorSource({ features: new Collection() }),
};

const REGION_LABEL_STYLE = new Style({
  text: new Text({
    font: "1.2rem 'Jost', sans-serif",
    text: '',
    stroke: new Stroke({
      color: '#000000',
      width: 2,
    }),
    overflow: true,
    fill: new Fill({
      color: '#ffffff',
    }),
  }),
});

const MAJOR_LABEL_STYLE = new Style({
  text: new Text({
    font: "1rem 'Jost', sans-serif",
    text: '',
    stroke: new Stroke({
      color: '#000000',
      width: 2,
    }),
    overflow: true,
    fill: new Fill({
      color: '#ffffff',
    }),
  }),
});

const REGION_STYLE = (feature) => {
  REGION_LABEL_STYLE.getText().setText(feature.get('notes'));
  return REGION_LABEL_STYLE;
};

const MAJOR_STYLE = (feature) => {
  MAJOR_LABEL_STYLE.getText().setText(feature.get('notes'));
  return MAJOR_LABEL_STYLE;
};

const REGION_LABEL_LAYER = new VectorLayer({
  title: 'Regions',
  searchable: true,
  source: IMMUTABLE_SOURCES.Region,
  zIndex: 100,
  minResolution: 4,
  style: REGION_STYLE,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
});

const MAJOR_LABEL_LAYER = new VectorLayer({
  title: 'Major Labels',
  searchable: true,
  source: IMMUTABLE_SOURCES.Major,
  zIndex: 100,
  maxResolution: 4,
  style: MAJOR_STYLE,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
});

const MINOR_LABEL_LAYER = new VectorLayer({
  title: 'Minor Labels',
  searchable: true,
  source: IMMUTABLE_SOURCES.Minor,
  zIndex: 99,
  maxResolution: 1.5,
  style: MAJOR_STYLE,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
});

const assembleImmutableLayers = (staticCollection) => {
  const parsed = regionParser(staticCollection);

  Object.keys(IMMUTABLE_SOURCES).forEach((key) => {
    IMMUTABLE_SOURCES[key].clear(true);
    IMMUTABLE_SOURCES[key].addFeatures(parsed[key]);
  });

  LABELS_LAYER_GROUP.getLayers().clear();
  LABELS_LAYER_GROUP.getLayers().push(REGION_LABEL_LAYER);
  LABELS_LAYER_GROUP.getLayers().push(MAJOR_LABEL_LAYER);
  LABELS_LAYER_GROUP.getLayers().push(MINOR_LABEL_LAYER);

  return LABELS_LAYER_GROUP;
};

function ImmutableLayer() {
  const olMap = useOlMap();
  const { safeApplyLayer, removeLayer } = useMapActions();
  const { mapStatic } = useLocalData();

  useEffect(() => {
    if (!olMap || !mapStatic) return undefined;
    const layerGroup = assembleImmutableLayers(mapStatic);
    safeApplyLayer(layerGroup);
    return (() => {
      removeLayer(layerGroup);
    });
  }, [olMap, mapStatic]);

  return null;
}

export default ImmutableLayer;
