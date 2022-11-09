import TileGrid from "ol/tilegrid/TileGrid";
import {Map, View, Collection} from "ol";
import {defaults} from "ol/control";
import {Group, Vector, Tile} from "ol/layer";
import {TileImage, Vector as VectorSource} from "ol/source";
import {GeoJSON} from "ol/format";
import {Style, Stroke, Circle} from "ol/style";
import {Select} from "ol/interaction";
import {addDefaultMapControls} from "./mapControls"
import Socket from "./webSocket";
import {never, singleClick} from "ol/events/condition";
const EditTools = require("./mapEditTools")

var map = new Map({
  controls: defaults(),
  target: 'map',
  layers: [
    new Group({
      // title: 'Map',
      // combine: true,
      layers: [
        new Tile({
          title: 'Map',
          type: 'base',
          // opacity: 0.7,
          source: new TileImage({
            attributions: '<a href="https://sentsu.itch.io/foxhole-better-map-mod" target="_blank">Sentsu</a> + <a href="https://www.foxholegame.com/" target="_blank">Siege Camp</a>',
            tileGrid: new TileGrid({
              extent: [0,-12432,11279,0],
              origin: [0,-12432],
              resolutions: [64,32,16,8,4,2,1],
              tileSize: [256, 256]
            }),
            tileUrlFunction: function(tileCoord) {
              return ('/uploads/{z}/{x}/{y}.webp'
                .replace('{z}', String(tileCoord[0]))
                .replace('{x}', String(tileCoord[1]))
                .replace('{y}', String(- 1 - tileCoord[2])));
            },
          })
        }),
      ]
    }),
  ],
  view: new View({
    center: [5625.500000, -6216.000000],
    resolution: 10.000000,
    resolutions: [64,32,16,8,4,2,1],
  })
});

addDefaultMapControls(map)
// Prevent context menu on map
document.getElementById('map').addEventListener('contextmenu', (e) => {
  e.preventDefault();
  return false;
})

const tools = new EditTools(map);

//@todo: move to tools
const selectStyle = () => {
  const trackStyle = tools.track.style();
  const white = [255, 255, 255, 1];
  const blue = [0, 153, 255, 1];
  return (feature, zoom) => {
    const type = feature.get('type')
    const circleStyle = [
      new Style({
        image: new Circle({
          stroke: new Stroke({
            width: 6,
            color: white,
          }),
          radius: 18,
        })
      }),
      new Style({
        image: new Circle({
          stroke: new Stroke({
            width: 2,
            color: blue,
          }),
          radius: 18,
        })
      })
    ]
    const lineStyle = [new Style({
      stroke: new Stroke({
        width: 6,
        color: white,
      })
    }),
      new Style({
        stroke: new Stroke({
          width: 3,
          color: blue,
        })
      })]
    const trackStyleHighlight = [new Style({
      stroke: new Stroke({
        width: 10,
        color: white,
      }),
      geometry: tools.track.geometryFunction
    }),
      new Style({
        stroke: new Stroke({
          width: 7,
          color: blue,
        }),
        geometry: tools.track.geometryFunction
      })
    ]
    let style
    switch (type) {
      case 'track':
        return [...trackStyleHighlight, trackStyle(feature, zoom)]

      case 'information':
        return tools.information.style(feature, zoom)

      case 'sign':
        return [...circleStyle, tools.sign.style(feature, zoom)]

      case 'facility':
        return [...circleStyle, tools.facility.style(feature, zoom)]

      case 'custom-facility':
        return [tools.customFacility.style(feature, zoom), ...lineStyle]

    }
  }
}

const select = new Select({
  multi: false,
  toggleCondition: never,
  condition: (event) => {
    if (['information', 'sign', 'facility', 'custom-facility'].includes(tools.selectedTool)) {
      return false;
    }
    return singleClick(event)
  },
  style: selectStyle()
});
tools.edit.setSelect(select)
map.addInteraction(select)

const trackInfo = document.getElementById('track-info'),
    iconInfo = document.getElementById('icon-info');

let selectedFeature = null
map.on('pointermove', (evt) => {
  if (selectedFeature) {
    return
  }
  const value = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
    return [feature, layer];
  });
  if (!value) {
    trackInfo.style.display = 'none';
    iconInfo.style.display = 'none';
  }
  else {
    const [feature, layer] = value;
    if (layer === null || layer.get('temp') === true) {
      trackInfo.style.display = 'none';
      iconInfo.style.display = 'none';
      return
    }
    infoBoxFeature(feature)
  }
})
select.on('select', (event) => {
  if (event.deselected.length > 0) {
    selectedFeature = null
    trackInfo.style.display = 'none';
    iconInfo.style.display = 'none';
  }
  if (event.selected.length > 0) {
    selectedFeature = event.selected[0]
  }
  if (selectedFeature) {
    infoBoxFeature(selectedFeature)
  }
  else {
    trackInfo.style.display = 'none';
    iconInfo.style.display = 'none';
  }
})

function infoBoxFeature(feature)
{
  if (feature.get('type') === 'track') {
    trackInfo.style.display = 'block';
    trackInfo.getElementsByClassName('clan')[0].innerHTML = feature.get('clan');
    trackInfo.getElementsByClassName('user')[0].innerHTML = feature.get('user');
    trackInfo.getElementsByClassName('time')[0].innerHTML = new Date(feature.get('time')).toLocaleString();
    trackInfo.getElementsByClassName('notes')[0].innerHTML = getNotes(feature);
  }
  else if (['information', 'sign', 'facility', 'custom-facility'].includes(feature.get('type'))) {
    iconInfo.style.display = 'block';
    iconInfo.getElementsByClassName('user')[0].innerHTML = feature.get('user');
    iconInfo.getElementsByClassName('time')[0].innerHTML = new Date(feature.get('time')).toLocaleString();
    iconInfo.getElementsByClassName('notes')[0].innerHTML = getNotes(feature)
  }
}

function getNotes(feature) {
  const note = feature.get('notes') || ''
  return note.replaceAll("\n", '<br>')
}

//
// add lines
//

const geoJson = new GeoJSON();
const collection = new Collection();
const clanCollections = {}
const clanGroup = new Group({
  title: 'Train Lines',
});
map.addLayer(clanGroup);
const socket = new Socket();

socket.on('acl', (acl) => {
  tools.initAcl(acl)
})

tools.allTracksCollection = collection

socket.on('tracks', (tracks) => {
  selectedFeature = null
  collection.clear()
  for (const clan in clanCollections) {
    clanCollections[clan].clear()
  }
  const col = geoJson.readFeatures(tracks)
  collection.extend(col)
})

collection.on('add', (e) => {
  const feature = e.element
  const clan = feature.get('clan')
  if (!(clan in clanCollections)) {
    clanCollections[clan] = createClanCollection(clan)
  }
  clanCollections[clan].push(feature)
})

function createClanCollection(clan) {
  const collection = new Collection()
  const sourceLine = new VectorSource({
    features: collection,
  });

  const vectorLine = new Vector({
    source: sourceLine,
    title: clan,
    style: (feature, zoom) => {
      return new Style({
        stroke: new Stroke({
          color: feature.get('color'),
          width: 5,
        }),
        geometry: tools.track.geometryFunction
      })
    }
  });
  clanGroup.getLayers().push(vectorLine);
  return collection;
}

tools.on(tools.EVENT_TRACK_ADDED, (track) => {
  socket.send('trackAdd', geoJson.writeFeatureObject(track.feature))
})

tools.on(tools.EVENT_TRACK_UPDATED, (track) => {
  socket.send('trackUpdate', geoJson.writeFeatureObject(track))
})

tools.on(tools.EVENT_TRACK_DELETE, (track) => {
  if (track && track.get('id')) {
    socket.send('trackDelete', {id: track.get('id')})
  }
})

tools.on(tools.EVENT_ICON_ADDED, (icon) => {
  socket.send('iconAdd', geoJson.writeFeatureObject(icon))
})

tools.on(tools.EVENT_ICON_UPDATED, (icon) => {
  if (icon && icon.get('id')) {
    socket.send('iconUpdate', geoJson.writeFeatureObject(icon))
  }
})

tools.on(tools.EVENT_ICON_DELETED, (icon) => {
  if (icon && icon.get('id')) {
    socket.send('iconDelete', {id: icon.get('id')})
  }
})

socket.on('icons', (features) => {
  const col = geoJson.readFeatures(features)
  tools.information.clearFeatures()
  tools.sign.clearFeatures()
  tools.facility.clearFeatures()
  tools.customFacility.clearFeatures();
  col.forEach((feature) => {
    switch (feature.get('type')) {
      case 'information':
        tools.information.addFeature(feature)
        break;
      case 'sign':
        tools.sign.addFeature(feature)
        break;
      case 'facility':
        tools.facility.addFeature(feature)
        break;
      case 'custom-facility':
        tools.customFacility.addFeature(feature)
        break;
    }
  })
})