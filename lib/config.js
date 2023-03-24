import YAML from 'yaml'
import chokidar from 'chokidar'
import fs from 'fs/promises'
import path from 'path'

const CONFIG_FILE = path.join(path.resolve('./data'), 'config.yml')
const DEFAULT_CONFIG_FILE = path.join(path.resolve(), 'config.dist.yml')

let memoryConfig

async function loadOrSetConfig () {
  return await fs.access(CONFIG_FILE, fs.constants.X_OK)
    .then(async () => {
      const watcher = chokidar.watch(CONFIG_FILE)
      watcher.on('change', () => {
        console.log('Config changed. Reloading.')
        updateMemoryConfig()
      })
      return updateMemoryConfig()
    })
    .catch(async () => {
      fs.copyFile(DEFAULT_CONFIG_FILE, CONFIG_FILE)
        .then(loadOrSetConfig())
    })
}

async function updateMemoryConfig () {
  return await fs.readFile(CONFIG_FILE, 'utf8')
    .then((readConfig) => {
      const parsedConfig = YAML.parse(readConfig, { intAsBigInt: true })
      memoryConfig = parsedConfig
      return parsedConfig
    })
}

async function setConfig (newConfig) {
  if (Object.is(newConfig, memoryConfig)) {
    return
  }
  fs.writeFile(CONFIG_FILE, YAML.stringify(newConfig, { intAsBigInt: true }))
    .then(memoryConfig = newConfig)
}

async function getConfig () {
  if (memoryConfig === undefined) {
    return await loadOrSetConfig()
  }
  return memoryConfig
}

export { getConfig, setConfig }
