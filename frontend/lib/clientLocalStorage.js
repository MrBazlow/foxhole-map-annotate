import LayerGroup from 'ol/layer/Group';

function retrieve(item) {
  return localStorage.getItem(item);
}

function read(item) {
  return JSON.parse(localStorage.getItem(item));
}

const warFeatures = retrieve('warFeatures') ? read('warFeatures') : { version: '', features: [], deactivatedRegions: [] };
const conquerStatus = retrieve('conquerStatus') ? read('conquerStatus') : { version: '', features: {} };

function recursiveLayerSet(bool = true) {

}

function enableLayerMemory(olMap) {

}

export {
  warFeatures, conquerStatus, recursiveLayerSet, enableLayerMemory,
};

/*
const staticLayer = new StaticLayers(map, conquerStatus, warFeatures)
const tools = new EditTools(map);
tools.staticLayer = staticLayer;
enableLayerMemory(map)
*/

/*
function enableLayerMemory(map) {
    // Load saved layer visibility state from localStorage.
    forEachRecursive(map, (layer) => {
        const title = layer.get('title');
        if (title) {
            const itemName = `map.layers.${title}.visible`;
            const savedValue = localStorage.getItem(itemName);
            if (savedValue) {
                const visible = (localStorage.getItem(itemName) === 'true');
                layer.setVisible(visible);
            }
            else if (layer.get('defaultVisible') === false) {
                layer.setVisible(false);
            }
        }
    });

    // When layer visibility changes, save the layer's visibility state to
    // localStorage.
    forEachRecursive(map, (layer) => {
        layer.on('change:visible', (e) => {
            const layer = e.target;
            const title = layer.get('title');
            if (title) {
                const visible = layer.get('visible');
                const itemName = `map.layers.${title}.visible`;
                localStorage.setItem(itemName, visible);
            }
        });
    });
}
*/
