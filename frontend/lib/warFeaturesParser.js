import { GeoJSON } from 'ol/format';

function warFeaturesParser(warFeatures) {
  if (Object.keys(warFeatures).length === 0) {
    return null;
  }
  const geoJson = new GeoJSON();
  const collections = {};
  warFeatures.forEach(
    (feature) => {
      const parsedFeature = geoJson.readFeature(feature);
      const type = parsedFeature.get('type');
      if (!Object.hasOwn(collections, type)) {
        collections[type] = [];
      }
      collections[type].push(parsedFeature);
    },
  );
  return collections;
}

export default warFeaturesParser;
