import { Container, interfaces } from 'inversify';

export const KernelService = Symbol('KernelService');
export const kernel: interfaces.Container = new Container({
  defaultScope: 'Singleton',
});

import { ModuleLoaderType } from './ModuleLoaderType';
import { infrastructureModule } from './infrastructure';
import config from './config';
import { restServerModule } from './infrastructure/restServer';

// v1.0
import { extensionsModule as extensionsModuleV10 } from './api/1.0/modules/extensions';
import { dbModule as dbModuleV10 } from './api/1.0/modules/db';
import { activitiesModule as activitiesModuleV10 } from './api/1.0/modules/activities';
import { projectsModule as projectsModuleV10 } from './api/1.0/modules/projects';
import { tasksModule as tasksModuleV10 } from './api/1.0/modules/tasks';
import { paginationModule as paginationModuleV10 } from './api/1.0/modules/pagination';
import { usersModule as usersModuleV10 } from './api/1.0/modules/users';
import { listsModule as listsModuleV10 } from './api/1.0/modules/lists';
import { filesModule as filesModuleV10 } from './api/1.0/modules/files';
import { fileStorageModule as fileStorageModuleV10 } from './api/1.0/modules/fileStorage';
import { commonModule as commonModuleV10 } from './api/1.0/modules/common';
import { checklistModule as checklistModuleV10 } from './api/1.0/modules/checklist';
import { onlineStatusModule as onlineStatusModuleV10 } from './api/1.0/modules/onlineStatus';
import { notificationsModule as notificationsModuleV10 } from './api/1.0/modules/notifications';
import { messagesModule as messagesModuleV10 } from './api/1.0/modules/messages';
import { organizationsModule as organizationsModuleV10 } from './api/1.0/modules/organizations';
import { scraperModule as scraperModuleV10 } from './api/1.0/modules/scraper';
import { mailerModule as mailerModuleV10 } from './api/1.0/modules/mailer';
import { tagsModule as tagsModuleV10 } from './api/1.0/modules/tags';
import { internalModule as internalModuleV10 } from './api/1.0/modules/internal';
import { tokenModule as tokenModuleV10 } from './api/1.0/modules/token';
import { passwordModule as passwordModuleV10 } from './api/1.0/modules/password';
import { authenticationModule as authenticationModuleV10 } from './api/1.0/modules/authentication';
import { feedModule as feedModuleV10 } from './api/1.0/modules/feed';
import { botModule as botModuleV10 } from './api/1.0/modules/bot';
import { messagingModule as messagingModuleV10 } from './api/1.0/modules/messaging';
import { openIdModule as openIdModuleV10 } from './api/1.0/modules/openId';
import { personalProjectOrderModule as personalProjectOrderModuleV10 } from './api/1.0/modules/projectPersonalStructure';
import { analyticsModule as analyticsModuleV10 } from './api/1.0/modules/analytics';
import { cacheModule as cacheModuleV10 } from './api/1.0/modules/cache';
import { orderModule as orderModuleV10 } from './api/1.0/modules/order';
import { processManagerModule as processManagerModuleV10 } from './api/1.0/modules/processManager';
import { cronModule as cronModuleV10 } from './api/1.0/modules/cron';
import { controllersModule as controllersModuleV10 } from './api/1.0/controllers';
import { postgresDataProvider as postgresDataProviderV10 } from './api/1.0/modules/postgresDataProvider';
import { consoleModule as consoleModuleV10 } from './api/1.0/modules/console';
import { exportModule as exportModuleV10 } from './api/1.0/modules/export';
import { oAuth2Module as oAuth2ModuleV10 } from './api/1.0/modules/oauth2';
import { oAuth1Module as oAuth1ModuleV10 } from './api/1.0/modules/oauth1';
import { integrationModule as integrationModuleV10 } from './api/1.0/modules/integration';
import { userStatusModule as userStatusModuleV10 } from './api/1.0/modules/userStatus';
import { chatWithMeModule as chatWithMeModuleV10 } from './api/1.0/modules/chatWithMe';
import { permissionsModule as permissionsModuleV10 } from './api/1.0/modules/permissions';
import { routesModule as routesModuleV10 } from './api/1.0/routes';
import { entityHistoryModule as entityHistoryModuleV10 } from './api/1.0/modules/entityHistory';
import { rateLimitModule as rateLimitModuleV10 } from './api/1.0/modules/rateLimiter';
import { userAppsModule as userAppsModuleV10 } from './api/1.0/modules/userApps';
import { messageQueueModule as messageQueueModuleV10 } from './api/1.0/modules/messageQueue';
import { settingsModule as settingsModuleV10 } from './api/1.0/modules/settings';

// v1.1
import { extensionsModule as extensionsModuleV11 } from './api/1.1/modules/extensions';
import { dbModule as dbModuleV11 } from './api/1.1/modules/db';
import { activitiesModule as activitiesModuleV11 } from './api/1.1/modules/activities';
import { projectsModule as projectsModuleV11 } from './api/1.1/modules/projects';
import { tasksModule as tasksModuleV11 } from './api/1.1/modules/tasks';
import { paginationModule as paginationModuleV11 } from './api/1.1/modules/pagination';
import { usersModule as usersModuleV11 } from './api/1.1/modules/users';
import { listsModule as listsModuleV11 } from './api/1.1/modules/lists';
import { filesModule as filesModuleV11 } from './api/1.1/modules/files';
import { fileStorageModule as fileStorageModuleV11 } from './api/1.1/modules/fileStorage';
import { commonModule as commonModuleV11 } from './api/1.1/modules/common';
import { checklistModule as checklistModuleV11 } from './api/1.1/modules/checklist';
import { onlineStatusModule as onlineStatusModuleV11 } from './api/1.1/modules/onlineStatus';
import { notificationsModule as notificationsModuleV11 } from './api/1.1/modules/notifications';
import { messagesModule as messagesModuleV11 } from './api/1.1/modules/messages';
import { organizationsModule as organizationsModuleV11 } from './api/1.1/modules/organizations';
import { scraperModule as scraperModuleV11 } from './api/1.1/modules/scraper';
import { mailerModule as mailerModuleV11 } from './api/1.1/modules/mailer';
import { tagsModule as tagsModuleV11 } from './api/1.1/modules/tags';
import { internalModule as internalModuleV11 } from './api/1.1/modules/internal';
import { tokenModule as tokenModuleV11 } from './api/1.1/modules/token';
import { passwordModule as passwordModuleV11 } from './api/1.1/modules/password';
import { authenticationModule as authenticationModuleV11 } from './api/1.1/modules/authentication';
import { feedModule as feedModuleV11 } from './api/1.1/modules/feed';
import { botModule as botModuleV11 } from './api/1.1/modules/bot';
import { messagingModule as messagingModuleV11 } from './api/1.1/modules/messaging';
import { openIdModule as openIdModuleV11 } from './api/1.1/modules/openId';
import { personalProjectOrderModule as personalProjectOrderModuleV11 } from './api/1.1/modules/projectPersonalStructure';
import { analyticsModule as analyticsModuleV11 } from './api/1.1/modules/analytics';
import { cacheModule as cacheModuleV11 } from './api/1.1/modules/cache';
import { orderModule as orderModuleV11 } from './api/1.1/modules/order';
import { processManagerModule as processManagerModuleV11 } from './api/1.1/modules/processManager';
import { cronModule as cronModuleV11 } from './api/1.1/modules/cron';
import { controllersModule as controllersModuleV11 } from './api/1.1/controllers';
import { postgresDataProvider as postgresDataProviderV11 } from './api/1.1/modules/postgresDataProvider';
import { consoleModule as consoleModuleV11 } from './api/1.1/modules/console';
import { exportModule as exportModuleV11 } from './api/1.1/modules/export';
import { oAuth2Module as oAuth2ModuleV11 } from './api/1.1/modules/oauth2';
import { oAuth1Module as oAuth1ModuleV11 } from './api/1.1/modules/oauth1';
import { integrationModule as integrationModuleV11 } from './api/1.1/modules/integration';
import { userStatusModule as userStatusModuleV11 } from './api/1.1/modules/userStatus';
import { chatWithMeModule as chatWithMeModuleV11 } from './api/1.1/modules/chatWithMe';
import { permissionsModule as permissionsModuleV11 } from './api/1.1/modules/permissions';
import { routesModule as routesModuleV11 } from './api/1.1/routes';
import { entityHistoryModule as entityHistoryModuleV11 } from './api/1.1/modules/entityHistory';
import { rateLimitModule as rateLimitModuleV11 } from './api/1.1/modules/rateLimiter';
import { userAppsModule as userAppsModuleV11 } from './api/1.1/modules/userApps';
import { messageQueueModule as messageQueueModuleV11 } from './api/1.1/modules/messageQueue';
import { settingsModule as settingsModuleV11 } from './api/1.1/modules/settings';
import { groupsModule as groupsModuleV11 } from './api/1.1/modules/groups';
import { dictModule as dictModuleV11 } from './api/1.1/modules/dict';
import { timeCampModule as timeCampModuleV11 } from './api/1.1/modules/timeCamp';
import { templateModule as templateModuleV11 } from './api/1.1/modules/templates';
import { searchModule as searchModuleV11 } from './api/1.1/modules/search';
import { webhookModule as webhookModuleV11 } from './api/1.1/modules/webhooks';
import { redisModule as redisModuleV11 } from './api/1.1/modules/redis';

kernel.bind<interfaces.Container>(KernelService).toConstantValue(kernel);

const modulesV10 = [
  extensionsModuleV10,
  dbModuleV10,
  activitiesModuleV10,
  projectsModuleV10,
  tasksModuleV10,
  paginationModuleV10,
  usersModuleV10,
  listsModuleV10,
  filesModuleV10,
  fileStorageModuleV10,
  commonModuleV10,
  checklistModuleV10,
  onlineStatusModuleV10,
  notificationsModuleV10,
  messagesModuleV10,
  organizationsModuleV10,
  scraperModuleV10,
  mailerModuleV10,
  tagsModuleV10,
  internalModuleV10,
  tokenModuleV10,
  passwordModuleV10,
  authenticationModuleV10,
  feedModuleV10,
  botModuleV10,
  messagingModuleV10,
  openIdModuleV10,
  personalProjectOrderModuleV10,
  analyticsModuleV10,
  cacheModuleV10,
  orderModuleV10,
  processManagerModuleV10,
  cronModuleV10,
  controllersModuleV10,
  postgresDataProviderV10,
  consoleModuleV10,
  exportModuleV10,
  oAuth2ModuleV10,
  oAuth1ModuleV10,
  integrationModuleV10,
  userStatusModuleV10,
  chatWithMeModuleV10,
  permissionsModuleV10,
  routesModuleV10,
  entityHistoryModuleV10,
  rateLimitModuleV10,
  userAppsModuleV10,
  messageQueueModuleV10,
  settingsModuleV10,
];

const modulesV11 = [
  extensionsModuleV11,
  dbModuleV11,
  activitiesModuleV11,
  projectsModuleV11,
  tasksModuleV11,
  paginationModuleV11,
  usersModuleV11,
  listsModuleV11,
  filesModuleV11,
  fileStorageModuleV11,
  commonModuleV11,
  checklistModuleV11,
  onlineStatusModuleV11,
  notificationsModuleV11,
  messagesModuleV11,
  organizationsModuleV11,
  scraperModuleV11,
  mailerModuleV11,
  tagsModuleV11,
  internalModuleV11,
  tokenModuleV11,
  passwordModuleV11,
  authenticationModuleV11,
  feedModuleV11,
  botModuleV11,
  messagingModuleV11,
  openIdModuleV11,
  personalProjectOrderModuleV11,
  analyticsModuleV11,
  cacheModuleV11,
  orderModuleV11,
  processManagerModuleV11,
  cronModuleV11,
  controllersModuleV11,
  postgresDataProviderV11,
  consoleModuleV11,
  exportModuleV11,
  oAuth2ModuleV11,
  oAuth1ModuleV11,
  integrationModuleV11,
  userStatusModuleV11,
  chatWithMeModuleV11,
  permissionsModuleV11,
  routesModuleV11,
  entityHistoryModuleV11,
  rateLimitModuleV11,
  userAppsModuleV11,
  messageQueueModuleV11,
  settingsModuleV11,
  groupsModuleV11,
  dictModuleV11,
  timeCampModuleV11,
  templateModuleV11,
  searchModuleV11,
  webhookModuleV11,
  redisModuleV11,
];

const modulesToLoad: ModuleLoaderType[] = [
  // Add additional modules here.
  infrastructureModule,
  restServerModule,
  ...modulesV10,
  ...modulesV11,
];

modulesToLoad.forEach((module) => module(kernel, config));
