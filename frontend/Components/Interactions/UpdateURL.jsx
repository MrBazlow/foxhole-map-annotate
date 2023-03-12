import { useEffect } from 'react';
import { useOlMap } from '../../State/MapState';

const UpdateURL = () => {
  const map = useOlMap();

  useEffect(() => {
    if (!map) return undefined;

    const update = (event) => {
      const center = event.map.getView().getCenter();
      const url = new URL(window.location);
      url.searchParams.set('cx', center[0].toFixed(5));
      url.searchParams.set('cy', center[1].toFixed(5));
      url.searchParams.set('r', event.map.getView().getResolution().toFixed(5));
      window.history.replaceState({}, '', url);
    };
    map.on('moveend', update);
    return (() => {
      map.un('moveend', update);
    });
  }, [map]);
};

export default UpdateURL;
