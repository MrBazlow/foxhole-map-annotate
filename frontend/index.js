import TileGrid from "ol/tilegrid/TileGrid"
import {Map, View} from "ol"
import {Attribution, defaults} from "ol/control"
import {Group, Tile} from "ol/layer"
import {TileImage} from "ol/source"
import {GeoJSON} from "ol/format"
import {addDefaultMapControls, enableLayerMemory} from "./mapControls"
import Socket from "./webSocket"
import StaticLayers from "./staticLayer"
import {DragPan} from "ol/interaction"
import {all, noModifierKeys} from "ol/events/condition"
import {assert} from "ol/asserts"
import Flags from "./flags"
import {Draggable} from "@neodrag/vanilla"
import {EditTools} from "./mapEditTools"
import "vanilla-colorful"
import "vanilla-colorful/hex-input.js"


const dragWindows = []
const applyDragWindow = (elementId) => {
  if (document.querySelector(`${elementId}`)) {
    dragWindows.push(new Draggable(document.querySelector(`${elementId}`), {bounds: 'main', defaultPosition: { x: 50, y: 80 }, handle: `${elementId}-handle` }))
  }
}

applyDragWindow('#edit-view')
applyDragWindow('#arty-view')
applyDragWindow('#flag-view')

Alpine.data('dropdownRoot', () => ({
  activeId: 1
}))

Alpine.data('dropdown', (number=1) => ({
  id: number,
  get active() {
    return this.activeId === this.id
  },
  set active(value) {
    this.activeId = value && this.id
  }
}))

const url = new URL(window.location);

var map = new Map({
  controls: defaults({
    attribution: false,
    zoom: false,
    rotate: false,
  }).extend([new Attribution({collapsible: false})]),
  target: 'map',
  layers: [
    new Group({
      // title: 'Map',
      // combine: true,
      layers: [
        new Tile({
          title: 'Map',
          type: 'base',
          preload: Infinity,
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
              return ('/map/{z}/{x}/{y}.webp'
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
    center: [url.searchParams.get('cx') ? parseFloat(url.searchParams.get('cx')) : 5625.500000, url.searchParams.get('cy') ? parseFloat(url.searchParams.get('cy')) : -6216.000000],
    resolution: url.searchParams.get('r') ? parseFloat(url.searchParams.get('r')) : 10.000000,
    minResolution: 0.5,
    maxResolution: 16,
  })
});

const zoomIn = () => {
  map.getView().animate({zoom: map.getView().getZoom() + 0.5, duration: 300})
}
const zoomOut = () => {
  map.getView().animate({zoom: map.getView().getZoom() - 0.5, duration: 300})
}

Alpine.store('mapZoom', {
  in: zoomIn,
  out: zoomOut
})

map.on('moveend', (event) => {
  const center = event.map.getView().getCenter()
  const url = new URL(window.location);
  url.searchParams.set('cx', center[0].toFixed(5));
  url.searchParams.set('cy', center[1].toFixed(5));
  url.searchParams.set('r', event.map.getView().getResolution().toFixed(5));
  window.history.replaceState({}, '', url);
})

addDefaultMapControls(map)

const warFeatures = localStorage.getItem('warFeatures') ? JSON.parse(localStorage.getItem('warFeatures')) : {version: '', features: [], deactivatedRegions: []}
const conquerStatus = localStorage.getItem('conquerStatus') ? JSON.parse(localStorage.getItem('conquerStatus')) : {version: '', features: {}}
const staticLayer = new StaticLayers(map, conquerStatus, warFeatures)
const tools = new EditTools(map);
tools.staticLayer = staticLayer;
enableLayerMemory(map)

window.tools = tools

Alpine.store('arty', {
  show: tools.sidebarArty.artyShow,
  hide: tools.sidebarArty.artyHide,
  copy: tools.sidebarArty.copySolution,
  guns: Object.getOwnPropertyNames(tools.sidebarArty.artilleryList),
})

Alpine.store('lines', tools.line.lineTypes)

Alpine.data('windows', () => ({
  artyView: false,
  editView: false,
  flagView: false,
  artyToggle() {
    this.artyView = ! this.artyView;
    document.dispatchEvent(new CustomEvent("artyMode", { detail: this.artyView }))
  },
  editToggle() {
    this.editView = ! this.editView
    //this.editView ? $store.edit.hide() : $store.edit.show()
  },
  flagToggle() {
    this.flagView = ! this.flagView
    //this.flagView ? $store.flag.hide() : $store.flag.show()
  },
}))

// Prevent context menu on map
document.getElementById('map').addEventListener('contextmenu', (e) => {
  if (tools.editMode) {
    e.preventDefault();
    return false;
  }
})

// Allow panning with middle mouse
const primaryPrimaryOrMiddle = function (mapBrowserEvent) {
  const pointerEvent = /** @type {import("../MapBrowserEvent").default} */ (
    mapBrowserEvent
  ).originalEvent;
  assert(pointerEvent !== undefined, 56); // mapBrowserEvent must originate from a pointer event
  return pointerEvent.isPrimary && (pointerEvent.button === 0 || pointerEvent.button === 1);
}
map.getInteractions().forEach((interaction) => {
  if (interaction instanceof DragPan) {
    interaction.condition_ = all(noModifierKeys, primaryPrimaryOrMiddle)
  }
})

const geoJson = new GeoJSON();
const socket = new Socket();

let lastClientVersion = null
let lastFeatureHash = ''
let realACL = null
socket.on('init', (data) => {
  realACL = data.acl
  if (data.warStatus === 'resistance') {
    data.acl = 'read'
  }
  tools.initAcl(data.acl)
  if (lastClientVersion === null) {
    lastClientVersion = data.version
  }
  else if (lastClientVersion !== data.version) {
    console.log('Version change detected, reloading page')
    window.location = '/'
  }
})

tools.on(tools.EVENT_ICON_ADDED, (icon) => {
  socket.send('featureAdd', geoJson.writeFeatureObject(icon))
})

tools.on(tools.EVENT_ICON_UPDATED, (icon) => {
  if (icon && icon.get('id')) {
    socket.send('featureUpdate', geoJson.writeFeatureObject(icon))
  }
})

tools.on(tools.EVENT_ICON_DELETED, (icon) => {
  if (icon && icon.get('id')) {
    socket.send('featureDelete', {id: icon.get('id')})
  }
})

socket.on('allFeatures', (features) => {
  const col = geoJson.readFeatures(features)
  const collections = {}
  col.forEach((feature) => {
    const type = feature.get('type')
    if (!(type in collections)) {
      collections[type] = []
    }
    collections[type].push(feature)
  })
  for (const type in tools.icon.sources) {
    tools.icon.sources[type].clear(true)
    tools.icon.sources[type].addFeatures(collections[type] || [])
  }
  tools.polygon.source.clear(true)
  tools.polygon.source.addFeatures(collections['polygon'] || [])
  for (const clan in tools.line.sources) {
    tools.line.sources[clan].clear(true)
  }
  tools.line.allLinesCollection.clear()
  tools.line.allLinesCollection.extend(collections['line'] || [])
  lastFeatureHash = features.hash
})

socket.on('featureUpdate', ({operation, feature, oldHash, newHash}) => {
  if (lastFeatureHash !== oldHash) {
    socket.send('getAllFeatures', true)
    return
  }
  feature = geoJson.readFeature(feature)
  tools.emit(tools.EVENT_FEATURE_UPDATED, {operation, feature})
  lastFeatureHash = newHash
})

tools.on(tools.EVENT_DECAY_UPDATE, (data) => {
  socket.send('decayUpdate', data)
})

socket.on('decayUpdated', (data) => {
  tools.emit(tools.EVENT_DECAY_UPDATED, data)
})

tools.on(tools.EVENT_FLAG, (data) => {
  socket.send('flag', data)
})

socket.on('flagged', (data) => {
  tools.emit(tools.EVENT_FLAGGED, data)
})

new Flags(map, tools)

socket.on('conquer', (data) => {
  if (conquerStatus.version === data.version) {
    return
  }
  if (!data.full && data.oldVersion !== conquerStatus.version) {
    socket.send('getConquerStatus', true)
    return
  }
  staticLayer.conquerUpdate(data.features, !data.full)
  conquerStatus.version = data.version
  conquerStatus.features = data.full ? data.features : {...conquerStatus.features, ...data.features}
  if (warFeatures.version !== data.warVersion) {
    socket.send('getWarFeatures', true)
  }
  localStorage.setItem('conquerStatus', JSON.stringify(conquerStatus))
})

socket.on('warFeatures', (data) => {
  warFeatures.features = data.features
  warFeatures.deactivatedRegions = data.deactivatedRegions
  warFeatures.version = data.version
  staticLayer.warFeaturesUpdate()
  localStorage.setItem('warFeatures', JSON.stringify(warFeatures))
})

const prepareWarTimerElement = document.getElementById('resistance-timer')
let prepareWarTimerTimoutId = null
socket.on('warEnded', (data) => {
  document.getElementById('warNumber').innerHTML = `${data.shard} #${data.warNumber} (Resistance)`
  tools.resetAcl()
  document.getElementById('resistance').classList.add(data.winner === 'WARDENS' ? 'alert-success' : 'alert-warning')
  document.getElementById('resistance-winner').innerHTML = data.winner === 'WARDENS' ? 'Warden' : 'Colonial'
  document.getElementById('resistance-' + data.winner).style.display = ''
  prepareWarTimerElement.dataset.conquestEndTime = data.conquestEndTime
  document.getElementById('resistance').style.display = ''
  prepareWarTimer()
})

socket.on('warPrepare', (data) => {
  conquerStatus.version = ''
  conquerStatus.features = {}
  warFeatures.features = []
  warFeatures.deactivatedRegions = []
  warFeatures.version = ''
  staticLayer.resetWar()
  localStorage.setItem('warFeatures', JSON.stringify(warFeatures))
  document.getElementById('warNumber').innerHTML = `${data.shard} #${data.warNumber} (Preparing)`
  clearTimeout(prepareWarTimerTimoutId)
  document.getElementById('resistance').style.display = 'none'
  if (realACL) {
    tools.initAcl(realACL)
  }
})

socket.on('warChange', (data) => {
  conquerStatus.version = ''
  conquerStatus.features = {}
  warFeatures.features = []
  warFeatures.deactivatedRegions = []
  warFeatures.version = ''
  staticLayer.resetWar()
  document.getElementById('warNumber').innerHTML = `${data.shard} #${data.warNumber}`
})

const disconnectedWarning = document.getElementById('disconnected')
socket.on('open', () => {
  disconnectedWarning.style.display = 'none'
  socket.send('init', {
    conquerStatus: conquerStatus.version,
    featureHash: lastFeatureHash,
    warVersion: warFeatures.version,
  })
})
socket.on('close', () => {
  disconnectedWarning.style.display = 'block'
})

const rtf = new Intl.RelativeTimeFormat('en', { style: 'long' })
function prepareWarTimer() {
  if (!prepareWarTimerElement.dataset.conquestEndTime) {
    return
  }
  const hours = (parseInt(prepareWarTimerElement.dataset.conquestEndTime) + 43200000 - Date.now()) / 3600000
  const minutes = (hours - Math.floor(hours)) * 60
  const formattedMinutes = rtf.formatToParts(Math.floor(minutes),'minute')
  prepareWarTimerElement.innerHTML = rtf.format(Math.floor(hours),'hour') + ' ' + formattedMinutes[1].value + ' ' + formattedMinutes[2].value
  prepareWarTimerTimoutId = setTimeout(prepareWarTimer, 30000)
}
if (document.getElementById('resistance').style.display === '') {
  prepareWarTimer()
}