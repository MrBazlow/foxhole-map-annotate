import { useEffect } from 'react';
import { Tile } from 'ol/layer';
import { TileImage } from 'ol/source';
import TileGrid from 'ol/tilegrid/TileGrid';
import { useOlMap, useMapActions } from '../../State/MapState';

const createBaseLayer = () => {
  const newBaseMap = new Tile({
    title: 'Map',
    canSearch: false,
    canToggle: false,
    type: 'base',
    preload: Infinity,
    source: new TileImage({
      tileGrid: new TileGrid({
        extent: [0, -12432, 11279, 0],
        origin: [0, -12432],
        resolutions: [64, 32, 16, 8, 4, 2, 1],
        tileSize: [256, 256],
      }),
      tileUrlFunction(tileCoord) {
        return '/map/{z}/{x}/{y}.webp'
          .replace('{z}', String(tileCoord[0]))
          .replace('{x}', String(tileCoord[1]))
          .replace('{y}', String(-1 - tileCoord[2]));
      },
    }),
  });
  return newBaseMap;
};

function BaseLayer() {
  const olMap = useOlMap();
  const { applyLayer, removeLayer } = useMapActions();

  useEffect(() => {
    if (!olMap) return undefined;
    const baseTileLayer = createBaseLayer();
    applyLayer(baseTileLayer);
    return () => {
      removeLayer(baseTileLayer);
    };
  }, [applyLayer, olMap, removeLayer]);

  return null;
}

export default BaseLayer;
