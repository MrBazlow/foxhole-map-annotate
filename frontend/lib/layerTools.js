const nestedLayerDo = (layerSet, func) => {
  if (!layerSet || typeof func !== 'function') return;
  if (layerSet.constructor.name === 'TileLayer') return;
  // eslint-disable-next-line no-console
  console.log(layerSet);
  const layerPack = layerSet.constructor.name === 'Collection' ? layerSet : layerSet.getLayers();

  layerPack.forEach((layer) => {
    if (layer.constructor.name === 'LayerGroup') {
      layer.getLayers().forEach(((subLayer) => {
        // eslint-disable-next-line no-console
        console.log(subLayer);
        nestedLayerDo(subLayer, func);
      }));
    }
    func(layer);
  });
};

export default nestedLayerDo;
