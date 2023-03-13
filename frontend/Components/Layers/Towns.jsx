import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Collection } from 'ol';
import { useEffect } from 'react';
import {
  Circle, Fill, Icon, Stroke, Style,
} from 'ol/style';
import { useOlMap, useMapActions } from '../../State/MapState';
import { useLiveData, useLocalData } from '../../State/DataState';
import {
  isVictoryBase, isScorched, isTownClaimed,
} from '../../lib/bitwiseLogic';

function assembleTownsLayer(staticCollection, warFeatures, cachedIconStyle = {}) {
  const localCachedIconStyle = cachedIconStyle;

  const town = new VectorSource({ features: new Collection() });

  town.clear(true);
  town.addFeatures(staticCollection.town);

  const iconStyle = (feature, resolution) => {
    const {
      icon, type, iconFlags, region,
    } = feature.getProperties();
    const team = feature.get('team') === 'none' ? '' : feature.get('team');

    if (region && warFeatures.deactivatedRegions.includes(region)) {
      return null;
    }
    if (icon === 'MapIconSafehouse' && resolution > 4) {
      return null;
    }
    const cacheKey = `${icon}${team}${iconFlags}`;

    if (!(cacheKey in localCachedIconStyle)) {
      let color;
      if (isScorched(iconFlags)) {
        color = '#C00000';
      } else if (team === 'Warden') {
        color = '#245682';
      } else if (team === 'Colonial') {
        color = '#516C4B';
      }

      localCachedIconStyle[cacheKey] = new Style({
        image: new Icon({
          src: `/images/${type}/${icon}.png`,
          color,
          scale: type === 'town' || type === 'field' || type === 'stormCannon' ? 2 / 3 : 1,
        }),
        zIndex: icon === 'MapIconSafehouse' ? 0 : undefined,
      });
    }
    if (isVictoryBase(iconFlags)) {
      const cacheKeyFlag = `${cacheKey}VP`;
      if (!(cacheKeyFlag in localCachedIconStyle)) {
        let color = '#a0a0a077';
        if (isScorched(iconFlags)) {
          color = '#C0000077';
        } else if (team === 'Warden' && isTownClaimed(iconFlags)) {
          color = '#24568277';
        } else if (team === 'Colonial' && isTownClaimed(iconFlags)) {
          color = '#516C4B77';
        }
        localCachedIconStyle[cacheKeyFlag] = new Style({
          image: new Circle({
            fill: new Fill({ color }),
            stroke: new Stroke({ width: 1, color: '#080807' }),
            radius: 16,
          }),
        });
      }
      return [
        localCachedIconStyle[cacheKeyFlag],
        localCachedIconStyle[cacheKey],
      ];
    }
    return localCachedIconStyle[cacheKey];
  };

  const townLayer = new VectorLayer({
    title: 'Towns/Relics',
    canSearch: false,
    canToggle: true,
    source: town,
    zIndex: 1,
    maxResolution: 5,
    style: iconStyle,
    updateWhileAnimating: true,
    updateWhileInteracting: true,
  });

  return [townLayer, localCachedIconStyle];
}

function Towns() {
  const olMap = useOlMap();
  const { applyLayer, removeLayer } = useMapActions();
  const { warFeatures } = useLocalData();
  const { mapStatic } = useLiveData();

  useEffect(() => {
    if (!olMap || !mapStatic || !warFeatures) return undefined;

    const [conquestLayer, localCachedIconStyle] = assembleTownsLayer(mapStatic, warFeatures);
    applyLayer(conquestLayer);

    return () => {
      removeLayer(conquestLayer);
    };
  }, [olMap, mapStatic, warFeatures, applyLayer, removeLayer]);

  return null;
}

export default Towns;
