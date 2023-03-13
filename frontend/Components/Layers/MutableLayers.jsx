import { Vector as VectorSource } from 'ol/source';
import {
  Circle, Fill, Icon, Stroke, Style, Text,
} from 'ol/style';
import { Group, Vector } from 'ol/layer';
import { GeoJSON } from 'ol/format';
import { Collection, Feature } from 'ol';
import CircleStyle from 'ol/style/Circle';
import { easeOut } from 'ol/easing';
import { getVectorContext } from 'ol/render';
import { unByKey } from 'ol/Observable';
import { LineString, Point } from 'ol/geom';

import { useOlMap, useMapActions } from '../../State/MapState';
import { useLocalData } from '../../State/DataState';
import regionParser from '../../lib/regionParser';
import {
  isVictoryBase, isBuildSite, isScorched, isTownClaimed,
} from '../../lib/bitwiseLogic';

const CACHED_ICON_STYLE = {};

const MUTABLE_SOURCES = {
  Towns: new VectorSource({ features: new Collection() }),
  Voronoi: new VectorSource({ features: new Collection() }),
  Industry: new VectorSource({ features: new Collection() }),
  Field: new VectorSource({ features: new Collection() }),
  StormCannon: new VectorSource({ features: new Collection() }),
  Grid: new VectorSource({ features: new Collection() }),
};



const GRID_LINE_STYLE = new Style({
  stroke: new Stroke({
    width: 1,
    color: '#333333',
  }),
  text: new Text({
    text: null,
  }),
});

const GRID_STYLE = (feature) => {
  if (feature.get('text') !== undefined) {
    GRID_LINE_STYLE.getText().setText(feature.get('text'));
  } else {
    GRID_LINE_STYLE.getText().setText(null);
  }
  return GRID_LINE_STYLE;
};

const CONQUEST_STYLE = (feature) => {
  const { team, region } = feature.getProperties();

  // Deactivated region logic here
  return CONQUEST_TEAM_STYLES[team === 'none' ? '' : team];
};

// eslint-disable-next-line react/function-component-definition
const ICON_STYLE = (feature, resolution) => {
  const icon = feature.get('icon');
  const team = feature.get('team');
  const iconFlags = feature.get('iconFlags');
  const type = feature.get('type');

  // Deactivated region logic here

  if (icon === 'MapIconSafehouse' && resolution > 4) {
    // safehouses are static but also want to show them only when showing industry
    return null;
  }

  const cacheKey = `${icon}${team}${iconFlags}`;

  if (!(cacheKey in CACHED_ICON_STYLE)) {
    let color;
    if (isScorched(iconFlags)) {
      color = '#C00000';
    } else if (team === 'Warden') {
      color = '#245682';
    } else if (team === 'Colonial') {
      color = '#516C4B';
    }

    CACHED_ICON_STYLE[cacheKey] = new Style({
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
    if (!(cacheKeyFlag in CACHED_ICON_STYLE)) {
      let color = '#a0a0a077';
      if (isScorched(iconFlags)) {
        color = '#C0000077';
      } else if (team === 'Warden' && isTownClaimed(iconFlags)) {
        color = '#24568277';
      } else if (team === 'Colonial' && isTownClaimed(iconFlags)) {
        color = '#516C4B77';
      }
      CACHED_ICON_STYLE[cacheKeyFlag] = new Style({
        image: new Circle({
          fill: new Fill({ color }),
          stroke: new Stroke({ width: 1, color: '#080807' }),
          radius: 16,
        }),
      });
    }
    return [
      CACHED_ICON_STYLE[cacheKeyFlag],
      CACHED_ICON_STYLE[cacheKey],
    ];
  }
  return CACHED_ICON_STYLE[cacheKey];
};

const GRID_LOADER = () => {

};

const GRID_LAYER = new Vector({
  title: 'Grid',
  source: MUTABLE_SOURCES.Grid,
  zIndex: 0,
  style: GRID_STYLE,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  defaultVisible: false,
});

const CONQUEST_LAYER = new Vector({
  title: 'Conquest',
  source: MUTABLE_SOURCES.Voronoi,
  zIndex: 1,
  style: CONQUEST_STYLE,
});

const TOWN_LAYER = new Vector({
  title: 'Towns/Relics',
  source: MUTABLE_SOURCES.Towns,
  zIndex: 1,
  style: ICON_STYLE,
  maxResolution: 5,
  updateWhileAnimating: true,
  updateWhileInteracting: true,

});

const INDUSTRY_LAYER = new Vector({
  title: 'Industry',
  source: MUTABLE_SOURCES.Industry,
  zIndex: 1,
  style: ICON_STYLE,
  maxResolution: 4,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
});

const FIELD_LAYER = new Vector({
  title: 'Fields',
  source: MUTABLE_SOURCES.Field,
  zIndex: 1,
  style: ICON_STYLE,
  maxResolution: 4,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
});

const STORM_CANNON_LAYER = new Vector({
  title: 'Storm Cannons',
  source: MUTABLE_SOURCES.StormCannon,
  zIndex: 6,
  style: ICON_STYLE,
  maxResolution: 6,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
});

const CREATE_STORM_CANNON_FEATURE = (id, conquer) => {
  const feat = new Feature({
    type: conquer.type,
    notes: conquer.notes,
    icon: conquer.icon,
    team: conquer.team,
    geometry: new Point(conquer.coordinates),
  });
  feat.setId(id);
  return feat;
};


const UPDATE_SCORE = (conquer) => {
  const score = {
    Warden: 0,
    Colonial: 0,
    None: 0,
    WardenUnclaimed: 0,
    ColonialUnclaimed: 0,
    NoneUnclaimed: 0,
    Total: conquer.requiredVictoryTowns,
  };

  MUTABLE_SOURCES.Towns.forEachFeature((feature) => {
    const iconFlags = feature.get('iconFlags') || 0;
    if (!isVictoryBase(iconFlags)) {
      return;
    }
    if (isScorched(iconFlags)) {
      score.Total -= 1;
    }
    if (isTownClaimed(iconFlags)) {
      score[feature.get('team')] += 1;
    }
    if (isVictoryBase(iconFlags)) {
      score[`${feature.get('team')}Unclaimed`] += 1;
    }
  });

  return score;
};

const assembleMutableLayers = (staticCollection) => {

};

function MutableLayers() {
  const olMap = useOlMap();
  const { applyLayer } = useMapActions();
  const { mapStatic } = useLocalData();

  if (olMap && mapStatic) {
    const layerGroup = assembleMutableLayers(mapStatic);
    applyLayer(layerGroup);
  }

  return null;
}

export default MutableLayers;
