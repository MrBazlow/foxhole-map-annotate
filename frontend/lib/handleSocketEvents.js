/*
 *  @module /frontend/lib/handleSocketEvents.js
 */

function handleSocketEvents(socket, set, get) {
  socket.on('open', () => {
    set((state) => {
      const newState = state;
      newState.ready = true;
      return newState;
    });
    const { conquer, init, warFeatures } = get().local;
    socket.send('init', {
      conquerStatus: conquer?.version || '',
      featureHash: init?.featureHash || '',
      warVersion: warFeatures?.version || '',
    });
  });

  socket.on('close', () => set((state) => {
    const newState = state;
    newState.ready = false;
    return newState;
  }));

  socket.on('init', (data) => {
    const { version } = get().local.init;
    if (version !== data.version) {
      console.log('Version change detected, reloading page');
      window.location.reload(true);
    }
    set((state) => {
      const newState = state;
      newState.local.init = data;
      return newState;
    });
  });

  socket.on('conquer', (data) => {
    const localVersion = get().local.conquer.version;
    const localWarFeatures = get().local.warFeatures;

    if (localWarFeatures.version !== data.warVersion) {
      socket.send('getWarFeatures', true);
    }

    if (localVersion === data.version) {
      return;
    }

    if (!data.full && localVersion !== data.version) {
      socket.send('getConquerStatus', true);
    }

    set((state) => {
      const newState = state;
      newState.local.conquer = data;
      newState.local.conquer.features = { ...state.local.conquer.features, ...data.features };
      newState.local.conquer.full = data.full ? data.full : false;
      return newState;
    });

    if (get().live.mapStatic) {
      get().actions.updateMapStatic();
    }
    get().actions.updateScore();
  });

  socket.on('warFeatures', (data) => {
    set((state) => {
      const newState = state;
      newState.local.warFeatures = data;
      return newState;
    });
    if (get().live.mapStatic) {
      get().actions.updateMapStatic();
      get().actions.updateScore();
    }
  });

  socket.on('allFeatures', (data) => {
    set((state) => {
      const newState = state;
      newState.local.allFeatures = data;
      return newState;
    });
    get().actions.readAllFeatures(data);
  });

  socket.on('featureUpdate', (data) => {
    const {
      operation,
      feature,
      oldHash,
      newHash,
    } = data;

    const lastFeatureHash = get().local.init.featureHash;

    if (lastFeatureHash !== oldHash) {
      socket.send('getAllFeatures', true);
      return;
    }

    // TODO
    console.log(operation);
    console.log(feature);
    console.log(oldHash);
    console.log(newHash);

    set((state) => {
      const newState = state;
      newState.local.featureUpdate = data;
      return newState;
    });
  });

  socket.on('decayUpdated', (data) => set((state) => {
    // TODO
    // tool emit event decay update { data }
    console.log('decayUpdated does not have a handler yet');
    const newState = state;
    newState.local.decayUpdated = data;
    return newState;
  }));

  socket.on('flagged', (data) => set((state) => {
    // TODO
    // tool emit event flagged { data }
    console.log('flagged does not have a handler yet');
    const newState = state;
    newState.local.flagged = data;
    return newState;
  }));

  socket.on('warChange', (data) => {
    set((state) => {
      const newState = state;
      newState.local.warChange = data;
      newState.local.conquer.version = '';
      newState.local.conquer.features = {};
      newState.local.warFeatures.features = [];
      newState.local.warFeatures.deactivatedRegions = [];
      newState.local.warFeatures.version = '';
      return newState;
    });
  });

  socket.on('warEnded', (data) => set((state) => {
    // reset account level
    // prepareWarTimer function call
    const newState = state;
    newState.local.warEnded = data;
    return newState;
  }));

  socket.on('warPrepare', (data) => {
    set((state) => {
      const newState = state;
      newState.local.warPrepare = data;
      newState.local.conquer.version = '';
      newState.local.conquer.features = {};
      newState.local.warFeatures.features = [];
      newState.local.warFeatures.deactivatedRegions = [];
      newState.local.warFeatures.version = '';
      return newState;
    });
  });
}

export default handleSocketEvents;
