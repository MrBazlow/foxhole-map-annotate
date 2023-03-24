import fs from 'fs'
import hash from 'object-hash'
import { trackUpdater, iconUpdater, featureUpdater } from './updater.js'
import path from 'path'

const dataDirectory = path.resolve('./data')
const FEATURE_FILE = path.join(dataDirectory, 'conquer.json')

function loadFeatures () {
  if (!fs.existsSync(FEATURE_FILE)) {
    return loadOldFeatures()
  }
  const content = fs.readFileSync(FEATURE_FILE, 'utf8')
  const parsed = JSON.parse(content)
  return featureUpdater(parsed)
}

function loadOldFeatures () {
  let tracks, icons
  const trackFileName = path.join(dataDirectory, 'tracks.json')
  const iconFileName = path.join(dataDirectory, 'icons.json')
  if (fs.existsSync(trackFileName)) {
    tracks = JSON.parse(fs.readFileSync(trackFileName, 'utf8'))
    tracks = trackUpdater(tracks)
  } else {
    tracks = {
      type: 'FeatureCollection',
      features: []
    }
  }
  if (fs.existsSync(iconFileName)) {
    icons = JSON.parse(fs.readFileSync(iconFileName, 'utf8'))
    icons = iconUpdater(icons)
  } else {
    icons = {
      type: 'FeatureCollection',
      features: []
    }
  }
  const features = {
    type: 'FeatureCollection',
    features: [...tracks.features, ...icons.features]
  }
  saveFeatures(features)
  if (features.features.length > 0) {
    fs.rmSync(trackFileName)
    fs.rmSync(iconFileName)
  }
  return featureUpdater(features)
}

function saveFeatures (features) {
  features.hash = hash(features)
  fs.writeFile(FEATURE_FILE, JSON.stringify(features), err => {
    if (err) {
      console.error(err)
    }
  })
}

export { loadFeatures, saveFeatures }
