import rootDirectory from '../rootDirectory';
import { ProcessDefinition, ProcessName, ProcessManagerConfig } from '../api/1.1/modules/processManager/types';
import * as path from 'path';
const processDir = path.join(rootDirectory, 'dist', 'process');

const definitions: ProcessDefinition[] = [
  {
    name: ProcessName.HEYSPACE_FEED,
    script: 'feed.js',
    env: {
      NODE_ENV: process.env.NODE_ENV,
    },
  },
  {
    name: ProcessName.HEYSPACE_CRON,
    script: 'cron.js',
    env: {
      NODE_ENV: process.env.NODE_ENV,
    },
  },
  {
    name: ProcessName.HEYSPACE_LINK_SCRAPER,
    script: 'linkScraper.js',
    env: {
      NODE_ENV: process.env.NODE_ENV,
    },
  },
  {
    name: ProcessName.HEYSPACE_NOTIFICATIONS_WORKER,
    script: 'notificationsWorker.js',
    env: {
      NODE_ENV: process.env.NODE_ENV,
    },
  },
  {
    name: ProcessName.HEYSPACE_DATA_IMPORT_WORKER,
    script: 'dataImportWorker.js',
    env: {
      NODE_ENV: process.env.NODE_ENV,
    },
  },
  {
    name: ProcessName.HEYSPACE_PROJECTS_WORKER,
    script: 'projectsWorker.js',
    env: {
      NODE_ENV: process.env.NODE_ENV,
    },
  },
];

const config: ProcessManagerConfig = {
  definitions,
  scriptRoot: processDir,
};

export default config;
