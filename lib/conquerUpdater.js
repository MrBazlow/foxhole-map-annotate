import warapi from '../lib/warapi.js'
import fs from 'fs/promises'
import { v4 as uuidV4 } from 'uuid'
import hash from 'object-hash'
import path from 'path'

const rootDir = path.resolve()
const conquerFileName = path.join(rootDir, '/data/conquer.json')
const warFileName = path.join(rootDir, '/data/war.json')
const staticFileName = path.join(rootDir, '/public/static.json')

const extent = [-2050, 1775]

const conquer = await fs.readFile(conquerFileName, 'utf8')
  .then((value) => { return JSON.parse(value) })
  .catch(() => { return { deactivatedRegions: undefined, regions: {}, features: {}, version: '' } })

const regions = await fs.readFile(staticFileName, 'utf8')
  .then((value) => { return JSON.parse(value) })
  .catch(() => { return {} })

const war = await fs.readFile(warFileName, 'utf8')
  .then((value) => { return JSON.parse(value) })
  .catch(() => { return { features: [], version: '' } })

function wait (time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

function fetchDeactivatedMaps () {
  return warapi.maps().then((data) => {
    conquer.deactivatedRegions = []
    for (const region of regions.features) {
      if (region.properties.type !== 'Region') {
        continue
      }
      if (!data.includes(region.id)) {
        conquer.deactivatedRegions.push(region.id)
      }
    }
    conquer.version = hash(conquer)
  })
}

function updateMap () {
  // Do not check map, war is not in progress
  if (warapi.warData.status !== warapi.WAR_IN_PROGRESS) {
    return new Promise((resolve) => {
      resolve(null)
    })
  }
  if (conquer.deactivatedRegions === undefined) {
    console.log('Missing deactivatedRegions')
    return fetchDeactivatedMaps().then(() => updateMap())
  }
  if (war.features.length === 0) {
    console.log('Missing warFeatures')
    return regenRegions().then(() => updateMap())
  }

  const promises = []
  const changed = []

  let waitTimeout = 0
  const allFeatures = [...regions.features, ...war.features]
  const existingStormCannons = {}
  const regionsLoaded = []
  for (const region of regions.features) {
    if (region.properties.type !== 'Region') {
      continue
    }
    if (conquer.deactivatedRegions.includes(region.id)) {
      continue
    }
    const version = region.id in conquer.regions ? conquer.regions[region.id] : null
    promises.push(wait(waitTimeout).then(() => warapi.dynamicMapETag(region.id, version)).then((data) => {
      if (data === null) {
        return
      }
      if (data.error && data.error === 'Unknown mapId') {
        return
      }
      regionsLoaded.push(region.id)
      conquer.regions[region.id] = data.version
      for (const item of data.mapItems) {
        if (item.iconType in warapi.iconTypes && (warapi.iconTypes[item.iconType].type === 'town' || warapi.iconTypes[item.iconType].type === 'industry' || warapi.iconTypes[item.iconType].type === 'stormCannon')) {
          const x = region.properties.box[0] - item.x * extent[0]
          const y = region.properties.box[1] - item.y * extent[1]
          const type = warapi.iconTypes[item.iconType].type
          const icon = warapi.iconTypes[item.iconType].icon
          const team = warapi.getTeam(item.teamId)
          const flags = item.flags || 0

          const feature = allFeatures.find((compare) => {
            return compare.geometry.coordinates[0] === x && compare.geometry.coordinates[1] === y && compare.properties.type === type
          })
          if (feature) {
            if (!(feature.id in conquer.features) || conquer.features[feature.id].team !== team || conquer.features[feature.id].icon !== icon || conquer.features[feature.id].flags !== flags) {
              conquer.features[feature.id] = { team, icon, flags }
              changed.push(feature.id)
            }
            if (type === 'stormCannon') {
              if (!(region.id in existingStormCannons)) {
                existingStormCannons[region.id] = []
              }
              existingStormCannons[region.id].push(feature.id)
            }
          } else if (type === 'stormCannon') {
            const id = uuidV4()
            conquer.features[id] = {
              team,
              icon,
              type,
              notes: warapi.iconTypes[item.iconType].notes,
              coordinates: [x, y],
              region: region.id
            }
            changed.push(id)
            if (!(region.id in existingStormCannons)) {
              existingStormCannons[region.id] = []
            }
            existingStormCannons[region.id].push(id)
          } else {
            console.log('Unable to find item in static.json', region.id, type, item)
          }
        }
        if (!(item.iconType in warapi.iconTypes)) {
          console.log('Unknown type ' + item.iconType, item)
        }
      }
    }).catch((e) => { console.log('warapi connection issue', e) }))
    waitTimeout += 100
  }

  return Promise.all(promises).then(async () => {
    const destroyedStormCannons = []
    for (const id in conquer.features) {
      if (conquer.features[id].type && conquer.features[id].type === 'stormCannon' &&
          regionsLoaded.includes(conquer.features[id].region) &&
          !existingStormCannons[conquer.features[id].region]?.includes(id)) {
        destroyedStormCannons.push(id)
        changed.push(id)
      }
    }
    if (changed.length === 0) {
      if (regionsLoaded.length > 0) {
        await fs.writeFile(conquerFileName, JSON.stringify(conquer, null, 2))
      }
      return null
    }
    const features = {}
    for (const id of changed) {
      features[id] = conquer.features[id]
      if (destroyedStormCannons.includes(id)) {
        features[id].destroyed = true
        delete conquer.features[id]
      }
    }
    conquer.version = hash(conquer)
    await fs.writeFile(conquerFileName, JSON.stringify(conquer, null, 2))
    return {
      version: conquer.version,
      warVersion: war.version,
      features,
      full: false
    }
  })
}

function regenRegions () {
  if (conquer.deactivatedRegions === undefined) {
    console.log('Missing deactivatedRegions')
    return fetchDeactivatedMaps().then(() => regenRegions())
  }
  const promises = []
  // fetch all fields/industries and current state of towns
  let waitTimeout = 0
  for (const region of regions.features) {
    if (region.properties.type !== 'Region') {
      continue
    }
    if (conquer.deactivatedRegions.includes(region.id)) {
      continue
    }
    promises.push(wait(waitTimeout).then(() => warapi.dynamicMap(region.id)).then((data) => {
      if (data.error && data.error === 'Unknown mapId') {
        return
      }
      conquer.regions[region.id] = null
      for (const item of data.mapItems) {
        if (item.iconType in warapi.iconTypes) {
          const type = warapi.iconTypes[item.iconType].type
          const icon = warapi.iconTypes[item.iconType].icon
          const notes = warapi.iconTypes[item.iconType].notes

          if (type === 'field' || type === 'industry') {
            const id = uuidV4()
            war.features.push({
              type: 'Feature',
              id,
              geometry: {
                type: 'Point',
                coordinates: [
                  region.properties.box[0] - item.x * extent[0],
                  region.properties.box[1] - item.y * extent[1]
                ]
              },
              properties: {
                type,
                icon,
                notes,
                id,
                user: 'World',
                time: '',
                team: ''
              }
            })
          }
        } else {
          console.log('Unknown type ' + item.iconType, item)
        }
      }
    }).catch((e) => { console.log('warapi connection issue', e) }))
    waitTimeout += 100
  }
  return Promise.all(promises).then(() => {
    saveRegions()
  })
}

async function clearRegions () {
  war.version = ''
  war.features = []
  conquer.version = ''
  conquer.regions = {}
  conquer.features = {}
  conquer.deactivatedRegions = undefined
  await saveRegions()
}

async function saveRegions () {
  war.version = hash(war)
  conquer.version = hash(conquer)
  const warJson = JSON.stringify(war)
  const conquerJson = JSON.stringify(conquer, null, 2)
  await fs.writeFile(warFileName, warJson)
  await fs.writeFile(conquerFileName, conquerJson)
}

function getConquerStatus () {
  return {
    version: conquer.version,
    features: conquer.features,
    warVersion: war.version,
    requiredVictoryTowns: warapi.warData.requiredVictoryTowns,
    full: true
  }
}

function getConquerStatusVersion () {
  return conquer.version
}

function getWarFeatures () {
  return {
    features: war.features,
    deactivatedRegions: conquer.deactivatedRegions,
    version: war.version
  }
}

function getWarFeaturesVersion () {
  return war.version
}

function clearRegionsCache () {
  for (const regionId of Object.keys(conquer.regions)) {
    conquer.regions[regionId] = 0
  }
  warapi.eTags = {}
  console.log('cleared region cache')
}

export {
  updateMap,
  regenRegions,
  clearRegions,
  getConquerStatus,
  getConquerStatusVersion,
  getWarFeatures,
  getWarFeaturesVersion,
  clearRegionsCache
}
