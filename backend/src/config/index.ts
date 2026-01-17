import config from './config';
import { defaultsDeepPreserveArrays } from '../utils';

let compiledConfig;
try {
  const localConfig = require('./config.local/index');
  console.log('LOCAL CONFIG FOUND');
  compiledConfig = defaultsDeepPreserveArrays({}, localConfig.default, config);
} catch (e) {
  console.warn('NO LOCAL FILE! USING DEFAULT');
  // No local  config files. No big deal!
  compiledConfig = config;
}

export default compiledConfig;
