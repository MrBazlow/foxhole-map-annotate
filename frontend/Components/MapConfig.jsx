import React, {
  useState, useEffect, useCallback, useId,
} from 'react';
import PropTypes from 'prop-types';
import { Popover } from '@headlessui/react';
import { useOlMap } from '../State/MapState';

function MapLayer({ layer }) {
  const inputId = useId();
  const [toggle, setToggle] = useState(layer.getVisible());

  const onChange = () => {
    layer.setVisible(!toggle);
    setToggle(!toggle);
  };

  return (
    <div
      className="group flex flex-row p-2"
    >
      <input
        id={inputId}
        type="checkbox"
        checked={toggle}
        onChange={onChange}
        className=""
      />
      <label
        htmlFor={inputId}
        className="w-max pl-2"
      >
        {layer.get('title')}
      </label>
    </div>
  );
}

MapLayer.propTypes = {
  layer: PropTypes.object.isRequired,
};

function MapConfig() {
  const olMap = useOlMap();
  const [toggle, setToggle] = useState(false);
  const [layers, setLayers] = useState([]);

  const fetchLayers = useCallback(() => {
    setLayers(olMap.getAllLayers().filter((layer) => layer.get('canToggle')));
  }, [olMap]);

  useEffect(() => {
    if (!olMap || !toggle) return;
    fetchLayers();
  }, [fetchLayers, olMap, toggle]);

  const layerElements = layers.map((layer) => (
    <div
      key={crypto.randomUUID()}
      className=""
    >
      <MapLayer layer={layer} />
    </div>
  ));

  return (
    <Popover className="relative">
      <Popover.Button
        onClick={() => setToggle(!toggle)}
        aria-label="Map Layers"
        className="group mx-2 hidden rounded-lg bg-transparent p-2 transition duration-200 hover:bg-warden-600 focus:outline-none focus:ring-2 focus:ring-warden-500 active:scale-95 aria-expanded:bg-warden-600 md:inline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-6 w-6 transition duration-200 group-hover:scale-125"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
          />
        </svg>
      </Popover.Button>
      <Popover.Panel
        className="absolute right-0 mt-4 w-fit origin-top-right divide-y divide-zinc-500 overflow-hidden rounded-lg bg-zinc-800 shadow-lg"
      >
        {layerElements}
      </Popover.Panel>
    </Popover>
  );
}

export default MapConfig;
