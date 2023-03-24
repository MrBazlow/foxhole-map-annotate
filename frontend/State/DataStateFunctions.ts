import { isScorched, isTownClaimed, isVictoryBase } from '@lib/bitwiseLogic'
import { GeoJSON } from 'ol/format'
import { propertyTypeSchema } from '@State/DataTypes'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'
import type {
  MapCollection,
  PartialMapCollection,
  StaticType,
  ScoreObject,
  ConquerData
} from '@State/DataTypes'

function regionParser (staticFeatures: StaticType['features'] | null | undefined): PartialMapCollection | null {
  if (staticFeatures == null) {
    return null
  }

  const geoJson = new GeoJSON()
  const collections: Record<string, Array<Feature<Geometry>>> = {}

  staticFeatures.forEach(
    (feature) => {
      const parsedFeature = geoJson.readFeature(feature)
      const type = propertyTypeSchema.parse(parsedFeature.get('type'))
      if (collections[type] === undefined) {
        collections[type] = []
      }
      collections[type].push(parsedFeature)
    }
  )
  return collections
}

function createNewScore (conquer: ConquerData | undefined): ScoreObject {
  const featureCollection = conquer?.features

  const scoreTemplate: ScoreObject = {
    Warden: 0,
    Colonial: 0,
    None: 0,
    WardenUnclaimed: 0,
    ColonialUnclaimed: 0,
    NoneUnclaimed: 0,
    Total: conquer?.requiredVictoryTowns ?? 32
  }

  const score: ScoreObject = Object.create(scoreTemplate)

  if (featureCollection === undefined) {
    return score
  }

  Object.values(featureCollection).forEach((feature) => {
    const iconFlags = feature?.flags ?? 0
    if (feature?.team === undefined) {
      return
    }
    const iconTeam = feature.team === '' ? 'None' : feature.team

    if (!isVictoryBase(iconFlags)) {
      return
    }
    if (isScorched(iconFlags)) {
      score.Total--
    }
    if (isTownClaimed(iconFlags)) {
      score[iconTeam] += 1
    }
    if (isVictoryBase(iconFlags)) {
      score[`${iconTeam}Unclaimed`] += 1
    }
  })
  return score
}

export { regionParser, createNewScore }
export type { MapCollection, PartialMapCollection }
