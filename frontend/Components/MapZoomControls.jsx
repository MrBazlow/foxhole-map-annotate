import React from 'react';
import { useOlMap } from '../State/MapState';

function MapZoomControls() {
  const olMap = useOlMap();

  const zoom = (dir) => {
    olMap
      .getView()
      .animate({
        zoom: olMap.getView().getZoom() + (dir ? 0.5 : -0.5),
        duration: 150,
      });
  };

  return (
    <div className="absolute bottom-5 right-5 flex flex-col text-white">
      <button
        type="button"
        onClick={() => zoom(true)}
        className="select-none rounded-t-md bg-warden-700 px-2 py-1 transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-warden-500 active:scale-95 active:bg-warden-900"
        aria-label="Zoom in"
      >
        +
      </button>
      <button
        type="button"
        onClick={() => zoom(false)}
        className="select-none rounded-b-md bg-warden-700 px-2 py-1 transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-warden-500 active:scale-95 active:bg-warden-900"
        aria-label="Zoom out"
      >
        –
      </button>
    </div>
  );
}

export default MapZoomControls;
