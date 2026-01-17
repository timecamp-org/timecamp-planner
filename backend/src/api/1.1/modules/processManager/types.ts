import { AnyDict } from '../common/types';

export type ProcessMessage = {
  type: string;
  topic: string;
  data: AnyDict;
};

export type SendDataToProcessResponse = AnyDict;
export type SendRequestToProcessResponse = AnyDict;

export type ProcessDefinition = {
  name: ProcessName;
  script: string;
  instances?: number | string;
  env?: AnyDict;
};

export enum ProcessName {
  HEYSPACE_API = 'heyspace_api',
  HEYSPACE_FEED = 'heyspace_feed',
  HEYSPACE_CRON = 'heyspace_cron',
  HEYSPACE_LINK_SCRAPER = 'heyspace_link_scraper',
  HEYSPACE_NOTIFICATIONS_WORKER = 'heyspace_notifications_worker',
  HEYSPACE_DATA_IMPORT_WORKER = 'heyspace_data_import_worker',
  HEYSPACE_PROJECTS_WORKER = 'heyspace_projects_worker',
}

export enum ProcessType {
  CONTROL_COMMAND = 'controlCommand',
  NOTIFICATION_COMMAND = 'notificationCommand',
}

export type ProcessDescription = {
  pm_id: number;
  name: ProcessName;
  pid: number;
};

export type ProcessManagerConfig = {
  scriptRoot: string;
  definitions: ProcessDefinition[];
};
