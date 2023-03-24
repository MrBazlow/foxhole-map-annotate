import { Circle, Fill, Icon, Stroke, Style } from 'ol/style'
import { isVictoryBase, isScorched, isTownClaimed } from './bitwiseLogic'

import type { FeatureLike } from 'ol/Feature'
import type { WarFeaturesData, Factions, Regions } from '@State/DataTypes'

const cachedIconStyle: Record<string, Style> = {}

const iconStyle = (feature: FeatureLike, resolution: number, warFeatures: WarFeaturesData): Style | Style[] => {
  const icon: string = feature.get('icon')
  const type: string = feature.get('type')
  const iconFlags: number = feature.get('iconFlags')
  const region: Regions = feature.get('region')

  const getTeam: Factions = feature.get('team')
  const team = getTeam === 'None' ? '' : getTeam

  const deactivatedRegions = warFeatures.deactivatedRegions ?? []
  if (region !== undefined && deactivatedRegions.includes(region)) {
    return new Style()
  }
  if (icon === 'MapIconSafehouse' && resolution > 4) {
    return new Style()
  }
  const cacheKey = `${icon}${team}${iconFlags}`

  if (!(cacheKey in cachedIconStyle)) {
    let color
    if (isScorched(iconFlags)) {
      color = '#C00000'
    } else if (team === 'Warden') {
      color = '#245682'
    } else if (team === 'Colonial') {
      color = '#516C4B'
    }

    cachedIconStyle[cacheKey] = new Style({
      image: new Icon({
        src: `/images/${type}/${icon}.png`,
        color,
        scale: ['town', 'field', 'stormCannon'].includes(type) ? 2 / 3 : 1
      }),
      zIndex: icon === 'MapIconSafehouse' ? 0 : undefined
    })
  }
  if (isVictoryBase(iconFlags)) {
    const cacheKeyFlag = `${cacheKey}VP`
    if (!(cacheKeyFlag in cachedIconStyle)) {
      let color = '#a0a0a077'
      if (isScorched(iconFlags)) {
        color = '#C0000077'
      } else if (team === 'Warden' && isTownClaimed(iconFlags)) {
        color = '#24568277'
      } else if (team === 'Colonial' && isTownClaimed(iconFlags)) {
        color = '#516C4B77'
      }
      cachedIconStyle[cacheKeyFlag] = new Style({
        image: new Circle({
          fill: new Fill({ color }),
          stroke: new Stroke({ width: 1, color: '#080807' }),
          radius: 16
        })
      })
    }
    return [
      cachedIconStyle[cacheKeyFlag],
      cachedIconStyle[cacheKey]
    ]
  }
  return cachedIconStyle[cacheKey]
}

export default iconStyle
