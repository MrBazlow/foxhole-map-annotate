import https from 'https'
import fs from 'fs/promises'
import path from 'path'
import { getConfig } from './config.js'

const config = await getConfig()
const warDataPath = path.join(path.resolve('./data'), 'wardata.json')

const fileWarData = await fs.readFile(warDataPath, 'utf8')
  .catch(() => { return { shard: config.shard.name, warNumber: 0, winner: 'NONE', status: this.WAR_IN_PROGRESS, conquestEndTime: null, conquestStartTime: null } })

class WarApi {
  EVENT_WAR_UPDATED = 'warUpdated'
  EVENT_WAR_ENDED = 'warEnded'
  EVENT_WAR_PREPARE = 'warPrepareNext'
  WAR_IN_PROGRESS = 'ongoing'
  WAR_RESISTANCE = 'resistance'
  WAR_PREPARE = 'prepare'

  eTags = {}
  callbacks = {}

  constructor () {
    this.warData = JSON.parse(fileWarData)
    if (!this.warData.status) {
      this.warData.status = this.getWarStatus(this.warData)
    }
  }

  on = (event, callback) => {
    if (!(event in this.callbacks)) {
      this.callbacks[event] = []
    }
    this.callbacks[event].push(callback)
  }

  emit = (event, data) => {
    if (event in this.callbacks) {
      for (const callback of this.callbacks[event]) {
        callback(data)
      }
    }
  }

  getWarStatus = (data = null) => {
    if (!data) {
      data = this.warData
    }
    const now = Date.now()
    if (data.winner === 'NONE' && data.conquestStartTime && now > data.conquestStartTime) {
      return this.WAR_IN_PROGRESS
    }
    // War end status for 12hours
    if (data.conquestEndTime && data.conquestEndTime + 43200000 > now) {
      return this.WAR_RESISTANCE
    }
    return this.WAR_PREPARE
  }

  warDataUpdate = () => {
    return this.war()
      .then(async (data) => {
        if (data) {
          data.shard = config.shard.name
          data.status = this.getWarStatus(data)
          // Buggy Api or already in preparation for next war
          // Ignoring old war data now, waiting for API to reflect next war
          if (this.warData.warNumber > data.warNumber) {
            return
          }
          if (((this.warData.status === this.WAR_PREPARE && data.warNumber === this.warData.warNumber) || (data.warNumber > this.warData.warNumber)) && data.status === this.WAR_IN_PROGRESS) {
            // We didn't prepare for this war!
            if (this.warData.status !== this.WAR_PREPARE) {
              console.log('Not prepared for war. Preparing now.')
              this.emit(this.EVENT_WAR_PREPARE, {
                newData: data,
                oldData: { ...this.warData }
              })
            }
            console.log('A new war begins!')
            this.emit(this.EVENT_WAR_UPDATED, {
              newData: data,
              oldData: { ...this.warData }
            })
          } else if (this.warData.status === this.WAR_IN_PROGRESS && data.status === this.WAR_RESISTANCE) {
            console.log('War is over!')
            this.emit(this.EVENT_WAR_ENDED, {
              newData: data,
              oldData: { ...this.warData }
            })
          } else if ((this.warData.status === this.WAR_RESISTANCE || this.warData.status === this.WAR_IN_PROGRESS) && data.status === this.WAR_PREPARE) {
            console.log('War never ends!')
            data = { shard: config.shard.name, warNumber: data.warNumber + 1, winner: 'NONE', status: this.WAR_PREPARE, conquestEndTime: null, conquestStartTime: null }
            this.emit(this.EVENT_WAR_PREPARE, {
              newData: data,
              oldData: { ...this.warData }
            })
          }
          this.warData = data
          await fs.writeFile(warDataPath, JSON.stringify(data, null, 2))
            .catch((error) => { console.log(error) })
        }
      })
      .catch((e) => {
        console.log('error fetching war data', e)
      })
  }

  staticMap = (hexId) => {
    return this.request('worldconquest/maps/' + hexId + '/static')
  }

  dynamicMap = (hexId) => {
    return this.request('worldconquest/maps/' + hexId + '/dynamic/public')
  }

  war = () => {
    return this.requestWithETag('worldconquest/war', null)
  }

  maps = () => {
    return this.request('worldconquest/maps')
  }

  dynamicMapETag = (hexId, version = null) => {
    if (version) {
      this.eTags['worldconquest/maps/' + hexId + '/dynamic/public'] = '"' + version + '"'
    }
    return this.requestWithETag('worldconquest/maps/' + hexId + '/dynamic/public')
  }

  requestWithETag = (path) => {
    return new Promise((resolve, reject) => {
      const errorCallback = (error) => {
        reject(error)
      }
      /**
       * @param {IncomingMessage} response
       */
      const callback = (response) => {
        let str = ''
        this.eTags[path] = response.headers.etag

        response.on('error', errorCallback)

        if (response.statusCode === 304) {
          resolve(null)
          // /dev/null data
          response.on('data', () => {
          })
          response.on('end', () => {
          })
        } else if (response.statusCode !== 200) {
          errorCallback(response.statusCode)
        } else {
          // another chunk of data has been received, so append it to `str`
          response.on('data', (chunk) => {
            str += chunk
          })

          // the whole response has been received, so we just print it out here
          response.on('end', () => {
            resolve(JSON.parse(str))
          })
        }
      }

      const req = https.request({
        host: config.shard.url,
        headers: {
          authorization: 'Bearer ' + this.token,
          'Content-Type': 'application/json',
          'If-None-Match': (path in this.eTags && this.eTags[path]) ? this.eTags[path] : ''
        },
        path: '/api/' + path
      }, callback).end()
      req.on('error', errorCallback)
    })
  }

  request = (path) => {
    return new Promise((resolve, reject) => {
      const errorCallback = (error) => {
        reject(error)
      }
      /**
       * @param {IncomingMessage} response
       */
      const callback = (response) => {
        let str = ''

        // another chunk of data has been received, so append it to `str`
        response.on('data', (chunk) => {
          str += chunk
        })

        // the whole response has been received, so we just print it out here
        response.on('end', () => {
          resolve(JSON.parse(str))
        })

        response.on('error', errorCallback)
      }

      const req = https.request({
        host: config.shard.url,
        headers: {
          authorization: 'Bearer ' + this.token,
          'Content-Type': 'application/json'
        },
        path: '/api/' + path
      }, callback).end()
      req.on('error', errorCallback)
    })
  }

  getTeam = (teamId) => {
    if (teamId === 'NONE') {
      return ''
    }
    if (teamId === 'COLONIALS') {
      return 'Colonial'
    }
    if (teamId === 'WARDENS') {
      return 'Warden'
    }
  }

  iconTypes = {
    11: {
      type: 'industry',
      icon: 'MapIconMedical',
      notes: 'Hospital'
    },
    12: {
      type: 'industry',
      icon: 'MapIconVehicle',
      notes: 'Vehicle Factory '
    },
    15: {
      type: 'industry',
      icon: 'MapIconWorkshop',
      notes: 'Workshop'
    },
    16: {
      type: 'industry',
      icon: 'MapIconManufacturing',
      notes: 'Manufacturing Plant'
    },
    17: {
      type: 'industry',
      icon: 'MapIconManufacturing',
      notes: 'Refinery'
    },
    18: {
      type: 'industry',
      icon: 'MapIconShipyard',
      notes: 'Shipyard'
    },
    19: {
      type: 'industry',
      icon: 'MapIconTechCenter',
      notes: 'Tech Center'
    },
    33: {
      type: 'industry',
      icon: 'MapIconStorageFacility',
      notes: 'Storage Depot'
    },
    34: {
      type: 'industry',
      icon: 'MapIconFactory',
      notes: 'Factory'
    },
    36: {
      type: 'industry',
      icon: 'MapIconAmmoFactory',
      notes: 'Ammo Factory'
    },
    39: {
      type: 'industry',
      icon: 'MapIconConstructionYard',
      notes: 'Construction Yard'
    },
    51: {
      type: 'industry',
      icon: 'MapIconMassProductionFactory',
      notes: 'Mass Production Factory'
    },
    52: {
      type: 'industry',
      icon: 'MapIconSeaport',
      notes: 'Seaport'
    },
    53: {
      type: 'industry',
      icon: 'MapIconCoastalGun',
      notes: 'Coastal Gun'
    },

    27: {
      type: 'town',
      icon: 'MapIconSafehouse',
      notes: 'Safehouse'
    },
    28: {
      type: 'town',
      icon: 'MapIconObservationTower',
      notes: 'Observation Tower'
    },
    35: {
      type: 'town',
      icon: 'MapIconSafehouse',
      notes: 'Safehouse'
    },
    37: {
      type: 'town',
      icon: 'MapIconRocketSite',
      notes: 'Rocket Site'
    },
    45: {
      type: 'town',
      icon: 'MapIconRelicBase',
      notes: 'Small Relic Base'
    },
    46: {
      type: 'town',
      icon: 'MapIconRelicBase',
      notes: 'Medium Relic Base'
    },
    47: {
      type: 'town',
      icon: 'MapIconRelicBase',
      notes: 'Big Relic Base'
    },
    56: {
      type: 'town',
      icon: 'MapIconTownBaseTier1',
      notes: 'Town Hall'
    },
    57: {
      type: 'town',
      icon: 'MapIconTownBaseTier2',
      notes: 'Town Hall'
    },
    58: {
      type: 'town',
      icon: 'MapIconTownBaseTier3',
      notes: 'Town Hall'
    },

    59: {
      type: 'stormCannon',
      icon: 'MapIconStormCannon',
      notes: 'Storm Cannon'
    },
    60: {
      type: 'stormCannon',
      icon: 'MapIconIntelCenter',
      notes: 'Intel Center'
    },

    20: {
      type: 'field',
      icon: 'MapIconSalvageColor',
      notes: 'Salvage Field'
    },
    21: {
      type: 'field',
      icon: 'MapIconComponentsColor',
      notes: 'Component Field'
    },
    23: {
      type: 'field',
      icon: 'MapIconSulfurColor',
      notes: 'Sulfur Field'
    },
    32: {
      type: 'field',
      icon: 'MapIconSulfurMineColor',
      notes: 'Sulfur Mine'
    },
    38: {
      type: 'field',
      icon: 'MapIconSalvageMineColor',
      notes: 'Salvage Mine'
    },
    40: {
      type: 'field',
      icon: 'MapIconComponentMineColor',
      notes: 'Component Mine'
    },
    61: {
      type: 'field',
      icon: 'MapIconCoalFieldColor',
      notes: 'Coal Field'
    },
    62: {
      type: 'field',
      icon: 'MapIconOilFieldColor',
      notes: 'Oil Field'
    }
  }
}

const newWarApi = new WarApi()

export default newWarApi
