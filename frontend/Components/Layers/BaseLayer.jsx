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
      attributions: '<a href="https://sentsu.itch.io/foxhole-better-map-mod" target="_blank">Sentsu</a> + <a href="https://www.foxholegame.com/" target="_blank">Siege Camp</a>',
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
  const map = useOlMap();
  const { applyLayer, removeLayer } = useMapActions();

  useEffect(() => {
    if (!map) return undefined;
    const baseTileLayer = createBaseLayer();
    applyLayer(baseTileLayer);
    return () => {
      removeLayer(baseTileLayer);
    };
  }, [map]);

  return null;
}

export default BaseLayer;
