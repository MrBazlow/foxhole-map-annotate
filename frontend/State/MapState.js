/*
 *  @module /frontend/State/MapState.js
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Pass an OpenLayer map object as parameter and assign it to store.olMap
const setMap = (newMap, setState) => setState(
  () => (
    { olMap: newMap }
  ),
);

// Safely apply a map layer, checks if already added first
const applyLayer = (layer, getState) => {
  const { olMap } = getState();
  const currentLayerNames = [];
  olMap.getLayers().forEach((element) => currentLayerNames.push(element.get('title')));

  if (currentLayerNames.includes(layer.get('title'))) {
    olMap.removeLayer(layer);
  }
  olMap.addLayer(layer);
};

// Safely remove a map layer, only removes if it exists on map already
const removeLayer = (layer, getState) => {
  const { olMap } = getState();
  const currentLayerNames = [];
  olMap.getLayers().forEach((element) => currentLayerNames.push(element.get('title')));
  if (currentLayerNames.includes(layer.get('title'))) {
    getState().olMap.removeLayer(layer);
  }
};

// Destroys the state.olMap object
const removeMap = (setState, getState) => {
  getState().olMap.setTarget(undefined);
  setState({ olMap: null });
};

// The state store for all things browser <===> OpenLayer Map related
const useMapStore = create(
  devtools(
    (setState, getState) => ({
      olMap: null,
      actions: {
        setMap: (newMap) => setMap(newMap, setState),
        applyLayer: (layer) => applyLayer(layer, getState),
        removeLayer: (layer) => removeLayer(layer, getState),
        removeMap: () => removeMap(setState, getState),
      },
    }),
  ),
);

// For direct interface with OpenLayers map object
const useOlMap = () => useMapStore((state) => state.olMap);

// Access actions
const useMapActions = () => useMapStore((state) => state.actions);

export { useMapStore, useMapActions, useOlMap };
