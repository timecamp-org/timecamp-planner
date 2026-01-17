import { AppConfigInterface } from 'common/types';

export function getConfig(): AppConfigInterface {
  if (window.__tc3_config) {
    console.log('Taking config from XHR config file');
    return window.__tc3_config;
  } else {
    console.warn(
      'Missing "window" config object, will try to import dynamically from common/config directory'
    );
    try {
      if (process.env.STORYBOOK_DEVICE !== 'browser') {
        console.log('Importing mobile config');
        return require('../config/mobile.config');
      } else {
        console.log('Importing web config');
        return require('../config/web.config');
      }
    } catch (error) {
      console.error('Cannot import config file');
      return {};
    }
  }
}
