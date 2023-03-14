import { GeoJSON } from 'ol/format';

function allFeaturesParser(input) {
  const geoJson = new GeoJSON();
  const readFeatures = geoJson.readFeatures(input);
  const collection = {};
  readFeatures.forEach((feature) => {
    const type = feature.get('type');
    if (!Object.hasOwn(collection, type)) {
      collection[type] = [];
    }
    collection[type].push(feature);
  });
  return collection;
}

export default allFeaturesParser;

/*

//'allFeatures'
//  geoJson reads allFeatures data
//  new collection object
//  for each geojson read feature:
//    get type
//    if type not in collection object
//    new obj[type]
//    obj[type].push feature
  for type in icon.sources
    sources[type] clear
    sources[type] add features from obj[type] or from []
  polygon.source clear
  polygon.source add features from obj['polygon'] or from []
  for clan in line.sources
    line.sources[clan] clear
  line.allLineCollection clear
  line.allLineCollection extend obj['line'] or from []
  lastFeatureHash is now data hash

*/