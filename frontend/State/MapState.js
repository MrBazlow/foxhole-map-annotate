/*
 *  @module /frontend/State/MapState.js
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const setMap = (newMap, setState) => setState(
  () => (
    { olMap: newMap }
  ),
);

const safeApplyLayer = (layer, getState) => {
  const { olMap } = getState();
  const currentLayerNames = [];
  olMap.getLayers().forEach((element) => currentLayerNames.push(element.get('title')));

  if (currentLayerNames.includes(layer.get('title'))) {
    olMap.removeLayer(layer);
  }

  olMap.addLayer(layer);
};

const applyLayer = (layer, getState) => {
  const { olMap } = getState();
  const currentLayerNames = [];
  olMap.getLayers().forEach((element) => currentLayerNames.push(element.get('title')));

  if (!currentLayerNames.includes(layer.get('title'))) {
    olMap.addLayer(layer);
  }
};

const removeLayer = (layer, getState) => {
  const { olMap } = getState();
  const currentLayerNames = [];
  olMap.getLayers().forEach((element) => currentLayerNames.push(element.get('title')));

  if (currentLayerNames.includes(layer.get('title'))) {
    getState().olMap.removeLayer(layer);
  }
};

const removeMap = (setState, getState) => {
  getState().olMap.setTarget(undefined);
  setState({ olMap: null });
};

const useMapStore = create(
  devtools(
    (setState, getState) => ({
      olMap: null,
      actions: {
        setMap: (newMap) => setMap(newMap, setState),
        applyLayer: (layer) => applyLayer(layer, getState),
        safeApplyLayer: (layer) => safeApplyLayer(layer, getState),
        removeLayer: (layer) => removeLayer(layer, getState),
        removeMap: () => removeMap(setState, getState),
      },
    }),
  ),
);

const useMapActions = () => useMapStore((state) => state.actions);
const useOlMap = () => useMapStore((state) => state.olMap);

export { useMapStore, useMapActions, useOlMap };
