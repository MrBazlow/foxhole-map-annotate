/*
 *  @module /frontend/State/DataState.js
 */

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import Socket from '../lib/webSocket';
import handleSocketEvents from '../lib/handleSocketEvents';
import createNewScore from '../lib/createNewScore';
import regionParser from '../lib/regionParser';
import warFeaturesParser from '../lib/warFeaturesParser';
import allFeaturesParser from '../lib/allFeaturesParser';

// If static.json is not cached, fetch it and then cache it
const fetchStatic = async (set) => {
  const response = await fetch(`${window.location.origin}/static.json`);
  const parse = await response.json();
  set((state) => {
    const newState = state;
    newState.local.mapStatic = parse;
    return newState;
  });
  return parse;
};

// Read static.json, if it's not cached fetchStatic otherwise parse it for use
const readStatic = async (set, get) => {
  const liveStatic = get().live.mapStatic ?? null;
  const localStatic = get().local.mapStatic ?? await get().actions.fetchStatic();
  if (!liveStatic) {
    set((state) => {
      const newState = state;
      newState.live.mapStatic = regionParser(localStatic);
      return newState;
    });
    get().actions.updateMapStatic();
  }
};

// When a new conquer websocket message is recieved we update liveStore score object
const updateScore = (set, get) => {
  const newConquer = get().local.conquer;
  const oldScore = get().live.score;
  set((state) => {
    const newState = state;
    newState.live.score = createNewScore(newConquer, oldScore);
    return newState;
  });
};

// TODO
const readAllFeatures = (set, get) => {
  const { allFeatures } = get().local;
  set((state) => {
    const newState = state;
    newState.live.allFeatures = allFeaturesParser(allFeatures);
    return newState;
  });
};

// Update live.mapStatic with new conquest & warFeature message contents
const updateMapStatic = (set, get) => {
  const oldMapStatic = get().live.mapStatic;
  const newConquer = get().local.conquer || {};
  const newFeatures = get().local.warFeatures.features || {};
  const packedNewStatic = { ...oldMapStatic, ...warFeaturesParser(newFeatures) };
  const voronoiMap = new Map();
  Object.values(packedNewStatic.town).forEach((feature) => {
    const featureId = feature.get('id');

    const newValues = newConquer.features[featureId];
    if (!Object.hasOwn(newConquer.features, featureId)) {
      return;
    }
    feature.set('team', newValues.team);
    feature.set('icon', newValues.icon, true);
    feature.set('iconFlags', newValues.flags, true);
    const townVoronoi = feature.get('voronoi');
    if (townVoronoi) {
      voronoiMap.set(townVoronoi, newValues.team);
    }
  });
  Object.values(packedNewStatic.voronoi).forEach((voronoiLayer) => {
    const layerId = voronoiLayer.getId();

    if (voronoiMap.has(layerId)) {
      voronoiLayer.set('team', voronoiMap.get(layerId));
    }
  });
  set((state) => {
    const newState = state;
    newState.live.mapStatic = packedNewStatic;
    return newState;
  });
  get().actions.updateScore();
};

// Use webSocket class and append our events to it
const newSocket = (set, get) => {
  const connection = new Socket();
  handleSocketEvents(connection, set, get);
  return connection;
};

// The state store for all things server <===> client related
const useDataStore = create(
  immer(
    persist(
      devtools(
        (set, get) => ({
          ws: newSocket(set, get),
          ready: true,
          live: {
            staticIcons: {},
            score: {},
          },
          local: {
            init: {},
            conquer: {},
            warFeatures: {},
            mapLayerSettings: {},
          },
          actions: {
            fetchStatic: () => fetchStatic(set),
            readStatic: () => readStatic(set, get),
            updateScore: () => updateScore(set, get),
            readAllFeatures: () => readAllFeatures(set, get),
            updateMapStatic: () => updateMapStatic(set, get),
          },
        }),
      ),
      {
        name: 'local',
        partialize: (state) => ({ local: state.local }),
      },
    ),
  ),
);

// For direct interface with socket class
const useWebSocket = () => useDataStore((store) => store.ws);

// Get connection status
const useReady = () => useDataStore((store) => store.ready);

// Access live stash
const useLiveData = () => useDataStore((store) => store.live);

// Access localContent stash
const useLocalData = () => useDataStore((store) => store.local);

// Access actions
const useDataActions = () => useDataStore((state) => state.actions);

export {
  useWebSocket, useReady, useLiveData, useLocalData, useDataActions, useDataStore,
};
