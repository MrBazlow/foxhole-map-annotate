import { produce } from 'immer'
import { type Socket } from './webSocket'
import type { DataState, DataGet, DataSet } from '@State/DataState'
import type { InitData, ConquerData } from '@State/DataTypes'

function handleSocketEvents (socket: InstanceType<typeof Socket>, set: DataSet, get: DataGet): void {
  socket.on('open', () => {
    set(produce((state: DataState) => { state.ready = true }))
    const { conquer, init, warFeatures } = get().local
    socket.send('init', {
      conquerStatus: conquer?.version ?? '',
      featureHash: init?.featureHash ?? '',
      warVersion: warFeatures?.version ?? ''
    })
  })

  socket.on('close', () => {
    set(produce((state: DataState) => { state.ready = false }))
  })

  socket.on('init', (data: InitData) => {
    const localInit = get().local.init ?? data
    if (localInit.version !== data.version) {
      console.log('Version change detected, reloading page')
      window.location.reload()
    }
    set(produce((state: DataState) => { state.local.init = data }))
  })

  socket.on('conquer', (data: ConquerData) => {
    const localConquer = get().local.conquer
    const localWarFeatures = get().local.warFeatures
    if (localWarFeatures?.version !== data.warVersion) {
      socket.send('getWarFeatures', true)
    }
    if (localConquer?.version === data.version) {
      return
    }
    if (!data.full && localConquer?.version !== data.version) {
      socket.send('getConquerStatus', true)
    }
    set(produce((state: DataState) => {
      const oldConquer = state.local.conquer
      if (data.full) {
        state.local.conquer = data
      } else {
        state.local.conquer = { ...oldConquer, ...data }
        state.local.conquer.features = { ...oldConquer?.features, ...data.features }
      }
      return state
    }))

    if (get().local.mapStatic === null) {
      get().actions.updateMapStatic()
    }
    get().actions.updateScore()
  })

  socket.on('warFeatures', (data: any) => {
    set(produce((state: DataState) => { state.local.warFeatures = data }))
    if (get().live.mapStatic != null) {
      get().actions.updateMapStatic()
      get().actions.updateScore()
    }
  })

  socket.on('allFeatures', (data: any) => {
    set(produce((state: DataState) => { state.local.allFeatures = data }))
    // get().actions.readAllFeatures(data)
  })

  socket.on('featureUpdate', (data: any) => {
    const { operation, feature, oldHash, newHash } = data

    const lastFeatureHash = get().local?.init?.featureHash ?? ''

    if (lastFeatureHash !== oldHash) {
      socket.send('getAllFeatures', true)
      return
    }

    // TODO
    console.log(operation)
    console.log(feature)
    console.log(oldHash)
    console.log(newHash)
    set(produce((state: DataState) => { state.local.featureUpdate = data }))
  })

  socket.on('decayUpdated', (data: any) => {
    // TODO
    // tool emit event decay update { data }
    console.log('decayUpdated does not have a handler yet')
    set(produce((state: DataState) => { state.local.decayUpdated = data }))
  })

  socket.on('flagged', (data: any) => {
    // TODO
    // tool emit event flagged { data }
    console.log('flagged does not have a handler yet')
    set(produce((state: DataState) => { state.local.flagged = data }))
  })

  socket.on('warChange', (data: any) => {
    set(produce((state) => {
      state.local.warChange = data
      state.local.conquer.version = ''
      state.local.conquer.features = {}
      state.local.warFeatures.features = []
      state.local.warFeatures.deactivatedRegions = []
      state.local.warFeatures.version = ''
      return state
    }))
  })

  socket.on('warEnded', (data: any) => {
    // reset account level
    // prepareWarTimer function call
    set(produce((state: DataState) => { state.local.warEnded = data }))
  })

  socket.on('warPrepare', (data: any) => {
    set(produce((state: DataState) => {
      state.local.warPrepare = data
      if (state.local.conquer !== undefined) {
        state.local.conquer.version = ''
        state.local.conquer.features = {}
      }
      if (state.local.warFeatures !== undefined) {
        state.local.warFeatures.features = []
        state.local.warFeatures.deactivatedRegions = []
        state.local.warFeatures.version = ''
      }
      return state
    }))
  })
}

export default handleSocketEvents
