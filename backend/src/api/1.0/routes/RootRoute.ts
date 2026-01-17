import { Router } from 'express'
import { VersionController } from '../controllers/VersionController'
import { RouteConfig, RouteLoader } from '../../../infrastructure/RouteLoader'
import { interfaces } from 'inversify'
import Container = interfaces.Container
import { RoutesModule } from './RoutesModule'
import { ProjectRouteConfig } from './ProjectRoutes'
import { ListRouteConfig } from './ListRoutes'
import { UserRouteConfig } from './UserRoutes'
import { OrganizationRouteConfig } from './OrganizationRoutes'
import { InternalRouteConfig } from './InternalRoutes'
import { TaskRouteConfig } from './TaskRoutes'
import { NotificationRouteConfig } from './NotificationRoutes'
import { TagRouteConfig } from './TagRoutes'
import { FileRouteConfig } from './FileRoutes'
import { MessageRouteConfig } from './MessageRoutes'
import { ActivityRouteConfig } from './ActivityRoutes'
import { UsageTrackerRouteConfig } from './UsageTrackerRoutes'
import { AuthenticationRouteConfig } from './AuthenticationRoutes'
import { OAuth1RouteConfig } from './OAuth1Routes'
import { OAuth2RouteConfig } from './OAuth2Routes'
import { ExtensionRouteConfig } from './ExtensionRoutes'
import { AnalyticsRouteConfig } from './AnalyticsRoutes'
import { ExportRouteConfig } from './ExportRoutes'
import { ChatWithMeRouteConfig } from './ChatWithMeRoutes'
import { UserAppsRouteConfig } from './UserAppsRoutes'
import { ChecklistRoutesConfig } from './ChecklistRoutes'
import { ViewSettingsRouteConfig } from './ViewSettingsRoutes'
import { ProjectPersonalStructureRouteConfig } from './ProjectPersonalStructureRoutes';

// All routes should be defined here. Leaf routes may be defined in specific controllers 
// (collection of dummyController, router decorators). This place binds all leaf routes together.

// Root router is for '/'

// You can mount each submodule on specific route:
// dummy dummyController will be on /dummy (eg. GET /dummy/dupa, POST /dummy/pipa)
// Actions registrar fn should be a decorator. Because of express'es conventions
// each mounted module uses it's own router.

//*

export const rootRoutes: (kernel: Container) => Router = (kernel) => {
  const projectRouteConfig = kernel.get<ProjectRouteConfig>(RoutesModule.ProjectRoutes);
  const listRouteConfig = kernel.get<ListRouteConfig>(RoutesModule.ListRoutes);
  const userRouteConfig = kernel.get<UserRouteConfig>(RoutesModule.UserRoutes);
  const organizationRouteConfig = kernel.get<OrganizationRouteConfig>(RoutesModule.OrganizationRoutes);
  const internalRouteConfig = kernel.get<InternalRouteConfig>(RoutesModule.InternalRoutes);
  const taskRouteConfig = kernel.get<TaskRouteConfig>(RoutesModule.TaskRoutes);
  const checklistRouteConfig = kernel.get<ChecklistRoutesConfig>(RoutesModule.ChecklistRoutes)
  const notificationRouteConfig = kernel.get<NotificationRouteConfig>(RoutesModule.NotificationRoutes);
  const tagRouteConfig = kernel.get<TagRouteConfig>(RoutesModule.TagRoutes);
  const fileRouteConfig = kernel.get<FileRouteConfig>(RoutesModule.FileRoutes);
  const messageRouteConfig = kernel.get<MessageRouteConfig>(RoutesModule.MessageRoutes);
  const activityRouteConfig = kernel.get<ActivityRouteConfig>(RoutesModule.ActivityRoutes);
  const usageTrackerRouteConfig = kernel.get<UsageTrackerRouteConfig>(RoutesModule.UsageTrackerRoutes);
  const authenticationRouteConfig = kernel.get<AuthenticationRouteConfig>(RoutesModule.AuthenticationRoutes);
  const oAuth1RouteConfig = kernel.get<OAuth1RouteConfig>(RoutesModule.OAuth1Routes);
  const oAuth2RouteConfig = kernel.get<OAuth2RouteConfig>(RoutesModule.OAuth2Routes);
  const extensionRouteConfig = kernel.get<ExtensionRouteConfig>(RoutesModule.ExtensionRoutes);
  const analyticsRouteConfig = kernel.get<AnalyticsRouteConfig>(RoutesModule.AnalyticRoutes);
  const exportRouteConfig = kernel.get<ExportRouteConfig>(RoutesModule.ExportRoutes);
  const chatWithMeRouteConfig = kernel.get<ChatWithMeRouteConfig>(RoutesModule.ChatWithMeRoutes);
  const appsRouteConfig = kernel.get<UserAppsRouteConfig>(RoutesModule.UserAppsRoutes);
  const viewSettingsRouteConfig = kernel.get<ViewSettingsRouteConfig>(RoutesModule.ViewSettingsRoutes);
  const projectPersonalStructureRouteConfig = kernel.get<ProjectPersonalStructureRouteConfig>(RoutesModule.ProjectPersonalStructureRoutes);

  const root = Router();


  // TODO: consider registering module subpath while initializing specific module
  const routeConfig: RouteConfig = {
    '/version': VersionController.versionAction,
    ...authenticationRouteConfig.getRouteConfig(),
    ...extensionRouteConfig.getRouteConfig(),
    
    '/oauth1': oAuth1RouteConfig.getPathConfig(),
    '/oauth': oAuth2RouteConfig.getPathConfig(),

    '/users': userRouteConfig.getPathConfig(),
    '/organizations': organizationRouteConfig.getPathConfig(),
    '/projects': projectRouteConfig.getPathConfig(),
    '/lists': listRouteConfig.getPathConfig(),
    '/tasks': taskRouteConfig.getPathConfig(),
    '/checklists': checklistRouteConfig.getPathConfig(),
    '/notifications': notificationRouteConfig.getPathConfig(),
    '/activities': activityRouteConfig.getPathConfig(),
    '/tags': tagRouteConfig.getPathConfig(),
    '/files': fileRouteConfig.getPathConfig(),
    '/messages': messageRouteConfig.getPathConfig(),
    '/usage-tracker': usageTrackerRouteConfig.getPathConfig(),

    '/_internal': internalRouteConfig.getPathConfig(),
    '/analytics': analyticsRouteConfig.getPathConfig(),

    '/export': exportRouteConfig.getPathConfig(),
    '/chatWithMe': chatWithMeRouteConfig.getPathConfig(),
    '/apps': appsRouteConfig.getPathConfig(),
    '/viewSettings': viewSettingsRouteConfig.getPathConfig(),

    ...projectPersonalStructureRouteConfig.getRouteConfig(),
  }

  function routerFactory() {
    return Router({ mergeParams: true });
  }

  const routeLoader = new RouteLoader(routerFactory);
  const parsedRoutes = routeLoader.parseConfig(routeConfig);

  const router = Router();
  // For now combine two routers -- old style and new style. We will gradually move to new style.
  router.use(root);
  router.use(parsedRoutes);
  return router;
}
