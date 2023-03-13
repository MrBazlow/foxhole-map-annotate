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

// If static.json is not cached, fetch it and then cache it
const fetchStatic = async (setState) => {
  const response = await fetch(`${window.location.origin}/static.json`);
  const parse = await response.json();
  setState((state) => {
    const newState = state;
    newState.localContent.mapStatic = parse;
    return newState;
  });
  return parse;
};

// Read static.json, if it's not cached fetchStatic otherwise parse it for use
const readStatic = async (setState, getState) => {
  const liveStatic = getState().liveContent.mapStatic ?? undefined;
  const localStatic = getState().localContent.mapStatic ?? await getState().actions.fetchStatic();
  if (!liveStatic) {
    setState((state) => {
      const newState = state;
      newState.liveContent.mapStatic = regionParser(localStatic);
      return newState;
    });
    getState().actions.updateMapStatic();
  }
};

// When a new conquer websocket message is recieved we update liveStore score object
const updateScore = (newConquer, setState, getState) => {
  const oldScore = getState().liveContent.score;
  const newScore = createNewScore(newConquer, oldScore);
  setState((state) => {
    const newState = state;
    newState.liveContent.score = newScore;
    return newState;
  });
};

// Update liveContent.mapStatic with new conquest message contents
const updateMapStatic = (setState, getState) => {
  const oldMapStatic = getState().liveContent.mapStatic;
  const newConquer = getState().localContent.conquer;
  const voronoiMap = new Map();
  Object.values(oldMapStatic.town).forEach((feature) => {
    const featureId = feature.get('id');
    const newValues = newConquer.features[featureId];
    if (Object.hasOwn(newConquer.features, featureId)) {
      feature.set('team', newValues.team);
      feature.set('icon', newValues.icon, true);
      feature.set('iconFlags', newValues.flags, true);
    }
    const townVoronoi = feature.get('voronoi');
    if (townVoronoi) {
      voronoiMap.set(townVoronoi, newValues.team);
    }
  });
  Object.values(oldMapStatic.voronoi).forEach((voronoiLayer) => {
    const layerId = voronoiLayer.getId();

    if (voronoiMap.has(layerId)) {
      voronoiLayer.set('team', voronoiMap.get(layerId));
    }
  });
  setState((state) => {
    const newState = state;
    newState.liveContent.mapStatic = oldMapStatic;
    return newState;
  });
};

const sendMessage = (getState, messageType, message) => {
  // send('type', {payload})
  getState().ws.send(messageType, message);
};

// Use webSocket class and append our events to it
const newSocket = (setState, getState) => {
  const connection = new Socket();
  handleSocketEvents(connection, setState, getState);
  return connection;
};

// The state store for all things server <===> client related
const useDataStore = create(
  immer(
    persist(
      devtools(
        (setState, getState) => ({
          ws: newSocket(setState, getState),
          ready: true,
          liveContent: {
            score: {},
          },
          localContent: {
            mapLayerSettings: {},
          },
          actions: {
            fetchStatic: () => fetchStatic(setState),
            readStatic: () => readStatic(setState, getState),
            updateScore: (newConquer) => updateScore(newConquer, setState, getState),
            updateMapStatic: () => updateMapStatic(setState, getState),
            sendMessage: (messageType, message) => sendMessage(getState, messageType, message),
          },
        }),
      ),
      {
        name: 'localContent',
        partialize: (state) => ({ localContent: state.localContent }),
      },
    ),
  ),
);

// For direct interface with socket class
const useWebSocket = () => useDataStore((store) => store.ws);

// Get connection status
const useReady = () => useDataStore((store) => store.ready);

// Access liveContent stash
const useLiveData = () => useDataStore((store) => store.liveContent);

// Access localContent stash
const useLocalData = () => useDataStore((store) => store.localContent);

// Access actions
const useDataActions = () => useDataStore((state) => state.actions);

export {
  useWebSocket, useReady, useLiveData, useLocalData, useDataActions, useDataStore,
};
