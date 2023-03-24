import { create, type StoreApi } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { produce } from 'immer'
import { Socket } from '../lib/webSocket'
import handleSocketEvents from '../lib/handleSocketEvents'
import { regionParser, createNewScore } from './DataStateFunctions'
import { staticTypeSchema } from './DataTypes'

import type {
  StaticFeature,
  StaticType,
  MapCollection,
  ScoreObject,
  InitData,
  ConquerData,
  WarFeaturesData,
  WarPrepareData,
  FeatureUpdateData,
  DecayUpdateData,
  FlaggedData,
  WarEndedData
} from './DataTypes'

type DataGet = StoreApi<DataState>['getState']
type DataSet = StoreApi<DataState>['setState']

interface DataState {
  ws: Socket
  ready: boolean
  live: {
    score: ScoreObject
    mapStatic: MapCollection | null
    allFeatures: null
  }
  local: {
    init?: InitData
    conquer?: ConquerData
    warFeatures?: WarFeaturesData
    warPrepare?: WarPrepareData
    mapStatic?: StaticType
    allFeatures?: null
    featureUpdate?: FeatureUpdateData
    decayUpdated?: DecayUpdateData
    flagged?: FlaggedData
    warEnded?: WarEndedData
    mapLayerSettings: Record<string, boolean>
  }
  actions: {
    fetchStatic: () => Promise<StaticType | null>
    readStatic: () => Promise<void>
    updateScore: () => void
    readAllFeatures: () => void
    updateMapStatic: () => void
  }
}

async function fetchStatic (set: DataSet): Promise<StaticType | null> {
  const response = await fetch(`${window.location.origin}/static.json`)
  if (!response.ok) {
    return null
  }
  const parse: StaticType = await response.json()

  set(produce((state: DataState) => { state.local.mapStatic = staticTypeSchema.parse(parse) }))
  return parse
}

async function readStatic (get: DataGet): Promise<void> {
  const liveStatic = get().live.mapStatic ?? null
  if (get().local?.mapStatic === undefined) {
    await get().actions.fetchStatic()
  }
  if (liveStatic === null) {
    get().actions.updateMapStatic()
  }
}

function updateScore (set: DataSet): void {
  set(produce((state: DataState) => {
    state.live.score = createNewScore(state.local.conquer)
    return state
  }))
}

function readAllFeatures (set: DataSet, get: DataGet): void {
  // TODO
  // const allFeatures = get().local.allFeatures
  // set((state) => {
  //   state.live.allFeatures = allFeaturesParser(allFeatures)
  //   return state
  // })
}

function updateMapStatic (set: DataSet, get: DataGet): void {
  const newConquer = get().local.conquer ?? null
  const currentMapStatic = get().live.mapStatic ?? regionParser(get().local.mapStatic?.features)
  const localWarFeatures = get().local.warFeatures ?? null
  const packedNewStatic = localWarFeatures !== null
    ? { ...currentMapStatic, ...regionParser(localWarFeatures.features) }
    : null
  if (packedNewStatic === null) {
    return
  }
  if (newConquer === null) {
    return
  }
  const voronoiMap = new Map()
  if (packedNewStatic.industry !== undefined) {
    Object.values(packedNewStatic.industry).forEach((feature) => {
      const featureId: string = feature.get('id')
      const newValues = newConquer.features[featureId]

      if (!Object.hasOwn(newConquer.features, featureId)) {
        return
      }
      feature.set('team', newValues.team)
      feature.set('icon', newValues.icon, true)
      feature.set('iconFlags', newValues.flags, true)
    })
  }
  if (packedNewStatic.town !== undefined) {
    Object.values(packedNewStatic.town).forEach((feature) => {
      const featureId = feature.get('id')
      const newValues = newConquer.features[featureId]
      if (!Object.hasOwn(newConquer.features, featureId)) {
        return
      }
      feature.set('team', newValues.team)
      feature.set('icon', newValues.icon, true)
      feature.set('iconFlags', newValues.flags, true)
      const townVoronoi = feature.get('voronoi') ?? null
      if (townVoronoi !== null) {
        voronoiMap.set(townVoronoi, newValues.team)
      }
    })
  }
  if (packedNewStatic.voronoi !== undefined) {
    Object.values(packedNewStatic.voronoi).forEach((voronoiLayer) => {
      const layerId = voronoiLayer.getId()
      if (voronoiMap.has(layerId)) {
        voronoiLayer.set('team', voronoiMap.get(layerId))
      }
    })
  }
  set(produce((state) => { state.live.mapStatic = packedNewStatic }))
  get().actions.updateScore()
}

function newSocket (set: DataSet, get: DataGet): Socket {
  const connection = new Socket()
  handleSocketEvents(connection, set, get)
  return connection
}

const useDataStore = create<DataState>()(
  persist(devtools(
    (set, get) => ({
      ws: newSocket(set, get),
      ready: true,
      live: {
        score: {
          Warden: 0,
          Colonial: 0,
          None: 0,
          WardenUnclaimed: 0,
          ColonialUnclaimed: 0,
          NoneUnclaimed: 0,
          Total: 0
        },
        mapStatic: null,
        allFeatures: null
      },
      local: {
        mapLayerSettings: {},
        allFeatures: null
      },
      actions: {
        fetchStatic: async () => await fetchStatic(set),
        readStatic: async () => { await readStatic(get) },
        updateScore: () => { updateScore(set) },
        readAllFeatures: () => { readAllFeatures(set, get) },
        updateMapStatic: () => { updateMapStatic(set, get) }
      }
    })
  ),
  {
    name: 'local',
    partialize: (state) => ({ local: state.local })
  })
)

const useWebSocket = (): Socket => useDataStore((store) => store.ws)
const useReady = (): boolean => useDataStore((store) => store.ready)
const useLiveData = (): DataState['live'] => useDataStore((store) => store.live)
const useLocalData = (): DataState['local'] => useDataStore((store) => store.local)
const useDataActions = (): DataState['actions'] => useDataStore((state) => state.actions)

export { useWebSocket, useReady, useLiveData, useLocalData, useDataActions, useDataStore }

export type { StaticFeature, StaticType, DataGet, DataSet, DataState }
