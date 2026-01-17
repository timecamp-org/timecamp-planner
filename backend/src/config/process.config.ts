import { defaults } from 'lodash';
import config from './process.config.static';

let compiledConfig;
try {
  const localConfig = require('./config.local/process.config');
  compiledConfig = defaults({}, localConfig.default, config);
} catch (e) {
  // No local  config files. No big deal!
  compiledConfig = config;
}

export default compiledConfig;
