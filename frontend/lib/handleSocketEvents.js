/*
 *  @module /frontend/lib/handleSocketEvents.js
 */

const handleSocketEvents = (socket, setState, getState) => {
  socket.on('open', () => setState((state) => {
    const newState = state;
    newState.ready = true;
    return newState;
  }));

  socket.on('close', () => setState((state) => {
    const newState = state;
    newState.ready = false;
    return newState;
  }));

  socket.on('init', (data) => setState((state) => {
    socket.send('init', data);
    const newState = state;
    newState.localContent.init = data;
    return newState;
  }));

  socket.on('conquer', (data) => {
    if (!data.full && getState().localContent.conquer.version !== data.version) {
      socket.send('getConquerStatus', true);
    }
    getState().actions.updateScore(data);
    setState((state) => {
      const newState = state;
      newState.localContent.conquer = data;
      return newState;
    });
  });

  socket.on('warFeatures', (data) => setState((state) => {
    const newState = state;
    newState.localContent.warFeatures = data;
    return newState;
  }));

  socket.on('allFeatures', (data) => setState((state) => {
    const newState = state;
    newState.localContent.warFeatures = data;
    return newState;
  }));

  socket.on('featureUpdate', (data) => setState((state) => {
    const newState = state;
    newState.localContent.warFeatures = data;
    return newState;
  }));

  socket.on('tools', (data) => setState((state) => {
    const newState = state;
    newState.localContent.warFeatures = data;
    return newState;
  }));

  socket.on('warChange', (data) => setState((state) => {
    const newState = state;
    newState.localContent.warFeatures = data;
    return newState;
  }));

  socket.on('warEnded', (data) => setState((state) => {
    const newState = state;
    newState.localContent.warFeatures = data;
    return newState;
  }));

  socket.on('warPrepare', (data) => setState((state) => {
    const newState = state;
    newState.localContent.warFeatures = data;
    return newState;
  }));
};

export default handleSocketEvents;
