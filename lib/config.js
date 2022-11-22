const YAML = require("yaml")
const fs = require("fs");

const CONFIG_FILE = __dirname + '/../data/config.yml'

if (!fs.existsSync(CONFIG_FILE)) {
  fs.copyFileSync(__dirname + '/../config.dist.yml', CONFIG_FILE)
}

class Config {

  constructor() {
    const content = fs.readFileSync(CONFIG_FILE, 'utf8')
    this.config = YAML.parse(content, {intAsBigInt: true})
  }

}

module.exports = new Config()