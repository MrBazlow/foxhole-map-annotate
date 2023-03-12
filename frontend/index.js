//import TileGrid from "ol/tilegrid/TileGrid"
//import {Map, View} from "ol"
//import {Attribution, defaults} from "ol/control"
//import {Group, Tile} from "ol/layer"
//import {TileImage} from "ol/source"
//import {GeoJSON} from "ol/format"
//import {addDefaultMapControls, enableLayerMemory} from "./mapControls"
//import Socket from "./webSocket"
//import StaticLayers from "./staticLayer"
//import {DragPan} from "ol/interaction"
//import {all, noModifierKeys} from "ol/events/condition"
//import {assert} from "ol/asserts"
//import Flags from "./flags"
//import {Draggable} from "@neodrag/vanilla"
//import EditTools from "./mapEditTools"
// React Bootstrap
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
const App = React.lazy(() => import("./Components/App"));

const rootElement = document.getElementById("react-root");
const renderRoot = createRoot(rootElement);

renderRoot.render(
	<StrictMode>
		<App />
	</StrictMode>
);


//const dragWindows = []
//const applyDragWindow = (elementId) => {
//  if (document.querySelector(`${elementId}`)) {
//    dragWindows.push(new Draggable(document.querySelector(`${elementId}`), {bounds: 'main', defaultPosition: { x: 50, y: 80 }, handle: `${elementId}-handle` }))
//  }
//}
//
//applyDragWindow('#edit-view')
//applyDragWindow('#arty-view')
//applyDragWindow('#flag-view')
//
//
//const url = new URL(window.location);

/*
const warFeatures = localStorage.getItem('warFeatures') ? JSON.parse(localStorage.getItem('warFeatures')) : {version: '', features: [], deactivatedRegions: []}
const conquerStatus = localStorage.getItem('conquerStatus') ? JSON.parse(localStorage.getItem('conquerStatus')) : {version: '', features: {}}
const staticLayer = new StaticLayers(map, conquerStatus, warFeatures)
const tools = new EditTools(map);
tools.staticLayer = staticLayer;
enableLayerMemory(map)
*/

/*
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
  //tools.initAcl(data.acl)
  if (lastClientVersion === null) {
    lastClientVersion = data.version
  }
  else if (lastClientVersion !== data.version) {
    console.log('Version change detected, reloading page')
    window.location = '/'
  }
})
*/
/*
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
*/
/*
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
*/
/*
tools.on(tools.EVENT_DECAY_UPDATE, (data) => {
  socket.send('decayUpdate', data)
})
*/
/*
socket.on('decayUpdated', (data) => {
  tools.emit(tools.EVENT_DECAY_UPDATED, data)
})
*/
/*
tools.on(tools.EVENT_FLAG, (data) => {
  socket.send('flag', data)
})
*/
/*
socket.on('flagged', (data) => {
  tools.emit(tools.EVENT_FLAGGED, data)
})
*/
/*
new Flags(map, tools)
*/
/*
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
*/
/*
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
  //document.getElementById('warNumber').innerHTML = `${data.shard} #${data.warNumber} (Resistance)`
  tools.resetAcl()
  //document.getElementById('resistance').classList.add(data.winner === 'WARDENS' ? 'alert-success' : 'alert-warning')
  //document.getElementById('resistance-winner').innerHTML = data.winner === 'WARDENS' ? 'Warden' : 'Colonial'
  //document.getElementById('resistance-' + data.winner).style.display = ''
  prepareWarTimerElement.dataset.conquestEndTime = data.conquestEndTime
  //document.getElementById('resistance').style.display = ''
  prepareWarTimer()
})
*/
/*
socket.on('warPrepare', (data) => {
  conquerStatus.version = ''
  conquerStatus.features = {}
  warFeatures.features = []
  warFeatures.deactivatedRegions = []
  warFeatures.version = ''
  staticLayer.resetWar()
  localStorage.setItem('warFeatures', JSON.stringify(warFeatures))
  //document.getElementById('warNumber').innerHTML = `${data.shard} #${data.warNumber} (Preparing)`
  clearTimeout(prepareWarTimerTimoutId)
  //document.getElementById('resistance').style.display = 'none'
  if (realACL) {
    tools.initAcl(realACL)
  }
})
*/
/*
socket.on('warChange', (data) => {
  conquerStatus.version = ''
  conquerStatus.features = {}
  warFeatures.features = []
  warFeatures.deactivatedRegions = []
  warFeatures.version = ''
  staticLayer.resetWar()
  document.getElementById('warNumber').innerHTML = `${data.shard} #${data.warNumber}`
})
*/
/*
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
*/
/*
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
*/
/*
if (document.getElementById('resistance').style.display === '') {
  prepareWarTimer()
}
*/



// Alpine.js Store

// Because ArtySidebar calls for tools... I actually do not know why
/*
window.tools = tools
*/
/*
Alpine.store('lines', tools.line.lineTypes)
Alpine.store('arty', {
  guns: Object.getOwnPropertyNames(tools.sidebarArty.artilleryList),
  azi: 0,
  dist: 0,
  windDir: (value) => { if (value > 359) {value = 0} else if (value < 0) {value = 359} else value = value},
  init() {
    document.addEventListener('artyUpdate', (event) => {
      Alpine.store('arty').azi = event.detail.azimuth
      Alpine.store('arty').dist = event.detail.distance
    })
    document.addEventListener('artyWindDir', (event) => {
      if (event.detail.direction > 359) {
        Alpine.store('arty').windDir = 0
      } else if (event.detail.direction < 0) {
        Alpine.store('arty').windDir = 359
      }
    })
  }
})

// Alpine.js Data

// Dropdown menu template pieces
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

Alpine.data('windows', () => ({
  artyView: false,
  editView: false,
  flagView: false,
  artyToggle() {
    if (this.editView) {this.editToggle()}
    if (this.flagView) {this.flagToggle()}
    this.artyView = ! this.artyView
    document.dispatchEvent(new CustomEvent("artyMode", { detail: { active: this.artyView }}))
  },
  editToggle() {
    if (this.artyView) {this.artyToggle()}
    if (this.flagView) {this.flagToggle()}
    this.editView = ! this.editView
    document.dispatchEvent(new CustomEvent("editMode", { detail: { active: this.editView }}))
  },
  flagToggle() {
    if (this.artyView) {this.artyToggle()}
    if (this.editView) {this.editToggle()}
    this.flagView = ! this.flagView
    document.dispatchEvent(new CustomEvent("flagMode", { detail: { active: this.flagView }}))
  },
  transition: () => ({
    'x-transition:enter': 'transition ease-out duration-300',
    'x-transition:enter-start': 'opacity-0',
    'x-transition:enter-end': 'opacity-100',
    'x-transition:leave': 'transition ease-in duration-300',
    'x-transition:leave-start': 'opacity-100',
    'x-transition:leave-end': 'opacity-0'
  })
}))
*/