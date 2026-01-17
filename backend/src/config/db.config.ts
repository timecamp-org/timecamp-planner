import { defaultsDeep } from 'lodash';
import config from './db.config.static';

let compiledConfig;
try {
  const localConfig = require('./config.local/db.config');
  compiledConfig = defaultsDeep({}, localConfig.default, config);
} catch (e) {
  // No local  config files. No big deal!
  compiledConfig = config;
}

export { dbNamingConverter } from './db.config.static'

export default compiledConfig;
