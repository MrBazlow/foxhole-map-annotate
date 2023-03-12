import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Map, View } from 'ol';
import { defaults } from 'ol/control';
import { useMapActions } from '../State/MapState';

const baseMap = (mapTarget) => {
  const url = new URL(window.location);
  const newMap = new Map({
    controls: defaults({
      zoom: false,
      rotate: false,
    }),
    target: mapTarget,
    view: new View({
      center: [
        url.searchParams.get('cx') ? parseFloat(url.searchParams.get('cx')) : 5625.5,
        url.searchParams.get('cy') ? parseFloat(url.searchParams.get('cy')) : -6216.0,
      ],
      resolution: url.searchParams.get('r') ? parseFloat(url.searchParams.get('r')) : 10.0,
      minResolution: 0.5,
      maxResolution: 16,
    }),
  });
  return newMap;
};

function OlMap({ children }) {
  const mapNode = useRef(null);
  const { setMap, removeMap } = useMapActions();

  useEffect(() => {
    const olMap = baseMap();
    olMap.setTarget(mapNode.current);
    setMap(olMap);
    return () => {
      removeMap();
    };
  }, [setMap, removeMap]);

  return (
    <div ref={mapNode} className="h-full w-full flex-none">{children}</div>
  );
}

OlMap.defaultProps = {
  children: undefined,
};

OlMap.propTypes = {
  children: PropTypes.node,
};

export default OlMap;
