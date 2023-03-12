import { GeoJSON } from 'ol/format';

const regionParser = (staticFeatures) => {
  const geoJson = new GeoJSON();
  const features = geoJson.readFeatures(staticFeatures);
  const collections = {};
  features.forEach((item) => {
    const type = item.get('type');
    if (!(type in collections)) {
      collections[type] = [];
    }
    collections[type].push(item);
  });
  return collections;
};

export default regionParser;
