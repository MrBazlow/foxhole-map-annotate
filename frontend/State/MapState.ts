/*
 *  @module /frontend/State/MapState.js
 */

import { create, type StoreApi } from 'zustand'
import { devtools } from 'zustand/middleware'
import { produce } from 'immer'
import type { Map } from 'ol'
import type { Layer, Group } from 'ol/layer'

type MapGet = StoreApi<MapState>['getState']
type MapSet = StoreApi<MapState>['setState']

interface MapState {
  olMap: Map | null
  actions: {
    setMap: (newMap: Map) => void
    applyLayer: (layer: Layer | Group) => void
    removeLayer: (layer: Layer | Group) => void
    removeMap: () => void
  }
}

function setMap (newMap: Map, set: MapSet): void {
  set(produce((state) => { state.olMap = newMap }))
}

function applyLayer (layer: Layer | Group, get: MapGet): void {
  const currentMap = get().olMap
  const currentLayerNames: Layer[] = []
  if (currentMap === null) {
    return
  }
  currentMap.getLayers().forEach((element) => currentLayerNames.push(element.get('title')))
  if (currentLayerNames.includes(layer.get('title'))) {
    currentMap.removeLayer(layer)
  }
  currentMap.addLayer(layer)
}

function removeLayer (layer: Layer | Group, get: MapGet): void {
  const currentMap = get().olMap
  const currentLayerNames: Layer[] = []
  if (currentMap === null) {
    return
  }
  currentMap.getLayers().forEach((element) => currentLayerNames.push(element.get('title')))
  if (currentLayerNames.includes(layer.get('title'))) {
    currentMap.removeLayer(layer)
  }
}

function removeMap (set: MapSet, get: MapGet): void {
  const currentMap = get().olMap
  if (currentMap !== null) {
    currentMap.setTarget(undefined)
  }
  set({ olMap: null })
}

const useMapStore = create<MapState>()(
  devtools(
    (set, get) => ({
      olMap: null,
      actions: {
        setMap: (newMap) => { setMap(newMap, set) },
        applyLayer: (layer) => { applyLayer(layer, get) },
        removeLayer: (layer) => { removeLayer(layer, get) },
        removeMap: () => { removeMap(set, get) }
      }
    })
  )
)

const useOlMap = (): MapState['olMap'] => useMapStore((state) => state.olMap)
const useMapActions = (): MapState['actions'] => useMapStore((state) => state.actions)

export { useMapStore, useMapActions, useOlMap }
