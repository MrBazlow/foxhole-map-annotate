import { never } from "ol/events/condition";
import { Style, Circle, Stroke, Fill } from "ol/style";
import { Circle as CircleGeo } from "ol/geom";
import { SelectEvent } from "ol/interaction/Select";
import { Select as OlSelect } from "ol/interaction";
import { Overlay, Collection, Feature } from "ol";
import { getTopLeft } from "ol/extent";
import { Vector as VectorSource } from "ol/source";
import { Vector } from "ol/layer";

const NO_TOOLTIP = ['Region', 'Major', 'Minor', 'voronoi', 'radius', 'grid']
const NOT_SELECTABLE = [...NO_TOOLTIP, 'town', 'industry', 'field']
const NO_USER_INFO = [...NOT_SELECTABLE, 'stormCannon']
const NO_CLOCK = [...NO_USER_INFO, 'sign']

/**
 * @param {import('ol/geom').Geometry} geometry
 */
function getLeftPoint(geometry) {
  return geometry.getClosestPoint(getTopLeft(geometry.getExtent()))
}


class Select {

  /**
   * @param {import('../mapEditTools')} tools
   * @param {import('ol').Map} map
   */
  constructor(tools, map) {
    this.tools = tools
    this.map = map

    this.selectOverlays = {}
    this.clocks = {}
    this.select = new OlSelect({
      multi: false,
      toggleCondition: never,
      style: this.selectStyle(),
      filter: (feature) => {
        return !(feature.get('type') && NOT_SELECTABLE.includes(feature.get('type')));
      }
    })

    this.select.on('select', (event) => {
      if (this.tools.editMode) {
        if (event.deselected.length > 0) {
          if (event.deselected[0]) {
            const type = event.deselected[0].get('type')
            if (type) {
              this.tools.emit(this.tools.EVENT_FEATURE_DESELECTED(type), event.deselected[0]);
            }
          }
        }
        if (event.selected.length > 0) {
          const type = event.selected[0].get('type')
          if (type && tools.hasAccess(type + '.edit', event.selected[0])) {
            this.tools.emit(this.tools.EVENT_FEATURE_SELECTED(type), event.selected[0]);
          }
        }
      }
      if (event.deselected.length > 0) {
        for (const feature of event.deselected) {
          this.deleteSelectOverlay(feature)
        }
      }
      if (event.selected.length > 0) {
        const feature = event.selected[0];
        const id = feature.getId()
        const infoBox = this.iconInfo.cloneNode(true)
        this.showIconInfoBox(infoBox, feature)
        this.clocks[id] = infoBox.getElementsByClassName('clock')[0]
        this.clocks[id].addEventListener('click', this.updateDecay)
        const flag = infoBox.getElementsByClassName('flag')[0];
        flag.addEventListener('click', this.flagIcon)
        infoBox.id = 'selected-' + id
        const overlay = new Overlay({
          element: infoBox,
          positioning: 'center-right',
          offset: [-20, 0],
          position: getLeftPoint(feature.getGeometry())
        })
        this.selectOverlays[id] = overlay
        this.map.addOverlay(overlay)
      }
    })

    tools.on(tools.EVENT_EDIT_MODE_ENABLED, () => {
      if (this.hasSelected()) {
        const selectedFeature = this.getSelectedFeature();
        const type = selectedFeature.get('type')
        tools.emit(tools.EVENT_FEATURE_SELECTED(type), selectedFeature);
      }
    })
    tools.on(tools.EVENT_ICON_UPDATED, this.deselectAll)
    tools.on(tools.EVENT_UPDATE_CANCELED, this.deselectAll)
    tools.on(tools.EVENT_ICON_DELETED, this.deleteSelectOverlay)

    map.addInteraction(this.select)

    this.iconInfo = document.getElementById('icon-info');

    this.iconInfoOverlay = new Overlay({
      element: this.iconInfo,
      positioning: 'top-left',
      offset: [10, 10]
    })
    this.map.addOverlay(this.iconInfoOverlay)

    map.on('pointermove', (evt) => {
      const value = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
        if (layer === null) {
          return null
        }
        if (layer.get('tooltip') === undefined || layer.get('tooltip') === true) {
          return [feature, layer];
        }
      });
      if (!value) {
        this.hideInfoBoxes()
      }
      else {
        const [feature, layer] = value;
        if (layer === null || NO_TOOLTIP.includes(feature.get('type'))) {
          this.hideInfoBoxes()
          return
        }
        this.infoBoxFeature(feature, evt.coordinate)
      }
    })

    tools.on(tools.EVENT_DECAY_UPDATED, (data) => {
      if (data.id in this.clocks) {
        this.setClockColor(this.clocks[data.id], new Date(data.time))
      }
    })

    tools.on(tools.EVENT_FLAGGED, (data) => {
      if (data.id in this.selectOverlays) {
        const flag = this.selectOverlays[data.id].element.getElementsByClassName('flag')[0];
        if (data.flags.includes(this.tools.userId)) {
          flag.classList.replace('bi-flag', 'bi-flag-fill')
        }
        else {
          flag.classList.replace('bi-flag-fill', 'bi-flag')
        }
      }
    })

    this.stormCannonSource = new VectorSource({
      features: new Collection()
    })
    map.addLayer(new Vector({
      source: this.stormCannonSource,
      zIndex: 0,
      maxResolution: 6,
      style: new Style({
        fill: new Fill({
          color: '#21252933'
        }),
      }),
      searchable: false,
      tooltip: false,
    }))
    map.on('click', (event) => {
      map.forEachFeatureAtPixel(event.pixel, (feature) => {
        if (feature.get('type') === 'stormCannon') {
          this.stormCannonSelected(feature)
        }
      }, {
        layerFilter: (layer) => {
          return layer.get('title') === 'Storm Cannons'
        }
      })
    })
    this.relativeTimeFormat = new Intl.RelativeTimeFormat("en", {
      numeric: "always",
      style: "narrow",
    });
  }

  selectStyle = () => {
    const trackStyle = this.tools.line.style();
    const white = [255, 255, 255, 1];
    const blue = [0, 153, 255, 1];
    const circleStyle = [
      new Style({
        image: new Circle({
          stroke: new Stroke({
            width: 6,
            color: white,
          }),
          radius: 18,
          declutterMode: "none",
        })
      }),
      new Style({
        image: new Circle({
          stroke: new Stroke({
            width: 2,
            color: blue,
          }),
          radius: 18,
          declutterMode: "none",
        })
      })
    ]
    const lineStyle = [new Style({
      stroke: new Stroke({
        width: 6,
        color: white,
      })
    }),
      new Style({
        stroke: new Stroke({
          width: 3,
          color: blue,
        })
      })]
    const trackStyleHighlight = [new Style({
        stroke: new Stroke({
          width: 10,
          color: white,
        }),
        geometry: this.tools.line.geometryFunction
      }),
      new Style({
        stroke: new Stroke({
          width: 7,
          color: blue,
        }),
        geometry: this.tools.line.geometryFunction
      }),
      new Style({
        stroke: new Stroke({
          width: 1,
          color: blue,
          lineDash: [10, 10]
        }),
      })
    ]
    return (feature, zoom) => {
      const type = feature.get('type')
      switch (type) {
        case 'line':
          trackStyleHighlight[0].getStroke().setLineDash(this.tools.line.getDashedOption(feature))
          trackStyleHighlight[1].getStroke().setLineDash(this.tools.line.getDashedOption(feature))
          return [...trackStyleHighlight, ...trackStyle(feature, zoom)]

        case 'information':
        case 'sign':
        case 'base':
        case 'facility':
        case 'facility-private':
        case 'facility-enemy':
          return [...circleStyle, this.tools.icon.iconStyle(feature, zoom)]

        case 'polygon':
          return [this.tools.polygon.style(feature, zoom), ...lineStyle]

        case 'stormCannon':
          return this.tools.staticLayer.iconStyle(feature, zoom)
      }
    }
  }

  infoBoxFeature = (feature, coords) => {
    this.iconInfoOverlay.setPosition(coords)
    this.showIconInfoBox(this.iconInfo, feature)
  }

  selectFeature = (feature) => {
    const oldFeature = this.select.getFeatures().pop()
    if (oldFeature) {
      this.tools.emit(this.tools.EVENT_FEATURE_DESELECTED(feature.get('type')), feature);
    }
    this.select.getFeatures().push(feature)
    this.changed()
  }

  deselectAll = () => {
    const feature = this.select.getFeatures().pop()
    if (feature) {
      this.tools.emit(this.tools.EVENT_FEATURE_DESELECTED(feature.get('type')), feature);
    }
    this.select.dispatchEvent(new SelectEvent('select', [], [feature], null))
  }

  getFeatures = () => {
    return this.select.getFeatures()
  }

  hasSelected = () => {
    return this.select.getFeatures().getLength() > 0
  }

  getSelectedFeature = () => {
    if (this.select.getFeatures().getLength() > 0) {
      return this.select.getFeatures().item(0)
    }
  }

  changed = () => {
    this.select.changed()
  }

  hideInfoBoxes = () => {
    this.iconInfoOverlay.setPosition(undefined)
  }

  showIconInfoBox = (node, feature) => {
    node.getElementsByClassName('placementInfo')[0].style.display = NO_USER_INFO.includes(feature.get('type')) ? 'none' : '';
    node.getElementsByClassName('user')[0].innerHTML = this.getUser(feature);
    this.clockColor(node.getElementsByClassName('clock')[0], feature)
    node.getElementsByClassName('notes')[0].innerHTML = this.getNotes(feature)
    const flag = node.getElementsByClassName('flag')[0];
    flag.dataset.id = feature.getId()
    if ((feature.get('flags') || []).includes(this.tools.userId)) {
      flag.classList.replace('bi-flag', 'bi-flag-fill')
    }
    else {
      flag.classList.replace('bi-flag-fill', 'bi-flag')
    }
  }

  clockColor = (clock, feature) => {
    if (NO_CLOCK.includes(feature.get('type'))) {
      clock.style.display = 'none'
      return
    }
    clock.style.display = ''
    const time = new Date(feature.get('time'))
    clock.dataset.id = feature.getId() || null
    clock.dataset.type = feature.get('type') || null
    this.setClockColor(clock, time)
  }

  setClockColor = (clock, time) => {
    const diff = new Date().getTime() - time.getTime()
    clock.getElementsByTagName('circle')[0].style.fill = this.getColorForPercentage((24 - diff/3600000)/24)
    clock.title = time.toLocaleString();
    if (diff < 3600000) {
      clock.getElementsByClassName('clock-time')[0].innerHTML = this.relativeTimeFormat.format(Math.round(-diff / 60000), 'minute')
    }
    else if (diff < 86400000) {
      clock.getElementsByClassName('clock-time')[0].innerHTML = this.relativeTimeFormat.format(Math.round(-diff / 3600000), 'hour')
    }
    else {
      clock.getElementsByClassName('clock-time')[0].innerHTML = this.relativeTimeFormat.format(Math.round(-diff / 86400000), 'day')
    }
  }

  percentColors = [
    { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
    { pct: 0.125, color: { r: 0xff, g: 0xa0, b: 0 } },
    { pct: 0.5, color: { r: 0xff, g: 0xe0, b: 0 } },
    { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } } ];

  getColorForPercentage = (pct) => {
    let i;
    for (i = 1; i < this.percentColors.length - 1; i++) {
      if (pct < this.percentColors[i].pct) {
        break;
      }
    }
    const lower = this.percentColors[i - 1];
    const upper = this.percentColors[i];
    const range = upper.pct - lower.pct;
    const rangePct = (pct - lower.pct) / range;
    const pctLower = 1 - rangePct;
    const pctUpper = rangePct;
    const color = {
      r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
      g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
      b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };
    return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
  };

  getNotes = (feature) => {
    const note = feature.get('notes') || ''
    return note.replaceAll("\n", '<br>')
  }

  getUser = (feature) => {
    return feature.get('clan') || feature.get('user') || 'World'
  }

  updateDecay = (event) => {
    if (event.currentTarget && event.currentTarget.dataset.id) {
      this.tools.emit(this.tools.EVENT_DECAY_UPDATE, {
        type: event.currentTarget.dataset.type,
        id: event.currentTarget.dataset.id
      })
    }
  }

  flagIcon = (event) => {
    if (event.currentTarget && event.currentTarget.dataset.id) {
      this.tools.emit(this.tools.EVENT_FLAG, {
        id: event.currentTarget.dataset.id
      })
    }
  }

  deleteSelectOverlay = (feature) => {
    if (feature === undefined) {
      return
    }
    if (feature.getId() in this.selectOverlays) {
      this.map.removeOverlay(this.selectOverlays[feature.getId()])
      delete this.selectOverlays[feature.getId()]
      delete this.clocks[feature.getId()]
    }
  }

  stormCannonSelected = (feature) => {
    const radius = this.stormCannonSource.getFeatureById('radius-' + feature.getId())
    if (radius) {
      this.stormCannonSource.removeFeature(radius)
    }
    else {
      let radiusInKm = 0
      if (feature.get('icon') === 'MapIconIntelCenter') {
        radiusInKm = 2000
      }
      else if (feature.get('icon') === 'MapIconStormCannon') {
        radiusInKm = 1000
      }
      const newRadius = new Feature({
        geometry: new CircleGeo(
          feature.getGeometry().getFirstCoordinate(),
          this.tools.MAGIC_MAP_SCALING_FACTOR * radiusInKm
        )
      })
      newRadius.set('type', 'radius')
      newRadius.setId('radius-' + feature.getId())
      this.stormCannonSource.addFeature(newRadius)
    }
  }

}

export default Select