import { isScorched, isTownClaimed, isVictoryBase } from './bitwiseLogic';

function createNewScore(conquer, oldScore) {
  const featureCollection = conquer.features;

  const scoreTemplate = {
    Warden: 0,
    Colonial: 0,
    None: 0,
    WardenUnclaimed: 0,
    ColonialUnclaimed: 0,
    NoneUnclaimed: 0,
    Total: conquer.requiredVictoryTowns,
  };

  const score = Object.keys(oldScore).length === 0 ? Object.create(scoreTemplate) : oldScore;

  Object.values(featureCollection).forEach((feature) => {
    const iconFlags = feature.flags || 0;
    if (!isVictoryBase(iconFlags)) {
      return;
    }
    if (isScorched(iconFlags)) {
      score.Total -= 1;
    }
    if (isTownClaimed(iconFlags)) {
      score[feature.team] += 1;
    }
    if (isVictoryBase(iconFlags)) {
      score[`${feature.team}Unclaimed`] += 1;
    }
  });
  return score;
}

export default createNewScore;
