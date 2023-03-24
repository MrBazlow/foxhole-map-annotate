import { z } from 'zod'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

type Coordinates = [number, number]

type PropertyType = 'Region' | 'Major' | 'Minor' | 'town' | 'voronoi' | 'industry' | 'field'

type Factions = 'None' | 'Warden' | 'Colonial' | ''

const regionList = [
  'TheFingersHex',
  'TempestIslandHex',
  'GreatMarchHex',
  'ViperPitHex',
  'MarbanHollow',
  'BasinSionnachHex',
  'DeadLandsHex',
  'HeartlandsHex',
  'EndlessShoreHex',
  'WestgateHex',
  'OarbreakerHex',
  'AcrithiaHex',
  'MooringCountyHex',
  'WeatheredExpanseHex',
  'MorgensCrossingHex',
  'LochMorHex',
  'StonecradleHex',
  'KalokaiHex',
  'AllodsBightHex',
  'RedRiverHex',
  'OriginHex',
  'HowlCountyHex',
  'SpeakingWoodsHex',
  'ShackledChasmHex',
  'TerminusHex',
  'LinnMercyHex',
  'ClansheadValleyHex',
  'NevishLineHex',
  'GodcroftsHex',
  'CallumsCapeHex',
  'FishermansRowHex',
  'ReachingTrailHex',
  'UmbralWildwoodHex',
  'CallahansPassageHex',
  'AshFieldsHex',
  'DrownedValeHex',
  'FarranacCoastHex'
] as const

type RegionTuple = typeof regionList[number]

type Regions = RegionTuple[number]

interface GeometryType {
  type: 'Point' | 'Polygon'
  coordinates: Coordinates | [Coordinates[]]
}

interface Properties {
  type: PropertyType
  icon?: string
  notes: string
  id?: string
  user?: 'World'
  time?: string
  team?: Factions
  region?: Regions
  box?: Coordinates
  flags?: number
}

interface StaticFeature {
  type: 'Feature'
  geometry: GeometryType
  properties: Properties
  id: string
}

interface StaticType {
  type: 'FeatureCollection'
  features: StaticFeature[]
}

type MapCollection = Record<PropertyType, Array<Feature<Geometry>>>

type PartialMapCollection = Partial<MapCollection>

interface ScoreObject {
  Warden: number
  Colonial: number
  None: number
  WardenUnclaimed: number
  ColonialUnclaimed: number
  NoneUnclaimed: number
  Total: number
}

interface InitData {
  acl: string
  featureHash: string
  shard: string
  version: string
  warNumber: number
  warStatus: string
}

interface Init {
  type: 'init'
  data: InitData
}

interface ConquerData {
  features: Record<string, StaticFeature['properties']>
  full: boolean
  requiredVictoryTowns?: number
  version: string
  warVersion: string
}

interface Conquer {
  type: 'conquer'
  data: ConquerData
}

// TODO
interface WarFeaturesData {
  features: StaticFeature[]
  deactivatedRegions?: Regions[] | []
  version: string
}

interface WarFeatures {
  type: 'warFeatures'
  data: WarFeaturesData
}

interface WarPrepareData {
  conquestEndTime: number | null
  conquestStartTime: number | null
  shard: string
  status: string
  warNUmber: number
  winner: string
}

interface WarPrepare {
  type: 'warPrepare'
  data: WarPrepareData
}

// TODO
interface FeatureUpdateData {
  operation: any
  feature: any
  oldHash: string
  newHash: string
}

interface FeatureUpdate {
  type: 'featureUpdate'
  data: FeatureUpdateData
}

// TODO
interface DecayUpdateData {
  data: any
}

interface DecayUpdate {
  type: 'decayUpdate'
  data: DecayUpdateData
}

interface FlaggedData {
  data: any
}

interface Flagged {
  type: 'flagged'
  data: FlaggedData
}

// TODO
interface WarEndedData {
  data: any
}

interface WarEnded {
  type: 'warEnded'
  data: WarEndedData
}

const coordinatesSchema = z.tuple([z.number(), z.number()])

const propertyTypeSchema = z.union([
  z.literal('Region'),
  z.literal('Major'),
  z.literal('Minor'),
  z.literal('town'),
  z.literal('voronoi'),
  z.literal('industry'),
  z.literal('field')
])

const factionsSchema = z.union([
  z.literal('None'),
  z.literal('Warden'),
  z.literal('Colonial'),
  z.literal('')
])

const regionsSchema = z.union([
  z.literal('TheFingersHex'),
  z.literal('TempestIslandHex'),
  z.literal('GreatMarchHex'),
  z.literal('ViperPitHex'),
  z.literal('MarbanHollow'),
  z.literal('BasinSionnachHex'),
  z.literal('DeadLandsHex'),
  z.literal('HeartlandsHex'),
  z.literal('EndlessShoreHex'),
  z.literal('WestgateHex'),
  z.literal('OarbreakerHex'),
  z.literal('AcrithiaHex'),
  z.literal('MooringCountyHex'),
  z.literal('WeatheredExpanseHex'),
  z.literal('MorgensCrossingHex'),
  z.literal('LochMorHex'),
  z.literal('StonecradleHex'),
  z.literal('KalokaiHex'),
  z.literal('AllodsBightHex'),
  z.literal('RedRiverHex'),
  z.literal('OriginHex'),
  z.literal('HowlCountyHex'),
  z.literal('SpeakingWoodsHex'),
  z.literal('ShackledChasmHex'),
  z.literal('TerminusHex'),
  z.literal('LinnMercyHex'),
  z.literal('ClansheadValleyHex'),
  z.literal('NevishLineHex'),
  z.literal('GodcroftsHex'),
  z.literal('CallumsCapeHex'),
  z.literal('FishermansRowHex'),
  z.literal('ReachingTrailHex'),
  z.literal('UmbralWildwoodHex'),
  z.literal('CallahansPassageHex'),
  z.literal('AshFieldsHex'),
  z.literal('DrownedValeHex'),
  z.literal('FarranacCoastHex')
])

const geometrySchema = z.object({
  type: z.union([
    z.literal('Point'),
    z.literal('Polygon')
  ]),
  coordinates: z.union([
    coordinatesSchema,
    z.tuple([
      z.array(coordinatesSchema)
    ])
  ])
})

const propertiesSchema = z.object({
  type: propertyTypeSchema,
  icon: z.optional(z.string()),
  notes: z.string(),
  id: z.optional(z.string()),
  user: z.optional(z.literal('World')),
  time: z.optional(z.string()),
  team: z.optional(factionsSchema),
  region: z.optional(regionsSchema),
  box: z.optional(coordinatesSchema),
  flags: z.optional(z.number())
})

const staticFeatureSchema = z.object({
  type: z.literal('Feature'),
  geometry: geometrySchema,
  properties: propertiesSchema,
  id: z.string()
})

const staticTypeSchema = z.object({
  type: z.literal('FeatureCollection'),
  features: z.array(staticFeatureSchema)
})

const scoreObjectSchema = z.object({
  Warden: z.number(),
  Colonial: z.number(),
  None: z.number(),
  WardenUnclaimed: z.number(),
  ColonialUnclaimed: z.number(),
  NoneUnclaimed: z.number(),
  Total: z.number()
})

export {
  coordinatesSchema,
  propertyTypeSchema,
  factionsSchema,
  regionsSchema,
  geometrySchema,
  propertiesSchema,
  staticFeatureSchema,
  staticTypeSchema,
  scoreObjectSchema
}

export type {
  Coordinates,
  PropertyType,
  Factions,
  Regions,
  GeometryType,
  Properties,
  StaticFeature,
  StaticType,
  MapCollection,
  PartialMapCollection,
  ScoreObject,
  InitData,
  Init,
  ConquerData,
  Conquer,
  WarFeaturesData,
  WarFeatures,
  WarPrepareData,
  WarPrepare,
  FeatureUpdateData,
  FeatureUpdate,
  DecayUpdateData,
  DecayUpdate,
  FlaggedData,
  Flagged,
  WarEndedData,
  WarEnded
}
