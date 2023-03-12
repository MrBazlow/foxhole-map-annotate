import { useEffect } from 'react';
import { useOlMap } from '../../State/MapState';

function DisableContextMenu() {
  const map = useOlMap();

  useEffect(() => {
    if (!map) return undefined;
    const handleEvent = (event) => {
      event.preventDefault();
      return false;
    };
    map.on('contextmenu', handleEvent);
    return (() => {
      map.un('contextmenu', handleEvent);
    });
  }, [map]);

  return null;
}

export default DisableContextMenu;
