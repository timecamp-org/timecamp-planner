import { ModuleLoaderType } from '../../../ModuleLoaderType'
import { RouteConfigInterface } from './RouteConfigInterface'
import { RoutesModule } from './RoutesModule'
import { InternalRouteConfig } from './InternalRoutes'
import { OrganizationRouteConfig } from './OrganizationRoutes'
import { ProjectRouteConfig } from './ProjectRoutes'
import { UserRouteConfig } from './UserRoutes'
import { ListRouteConfig } from './ListRoutes'
import { TaskRouteConfig } from './TaskRoutes'
import { NotificationRouteConfig } from './NotificationRoutes'
import { TagRouteConfig } from './TagRoutes'
import { FileRouteConfig } from './FileRoutes'
import { MessageRouteConfig } from './MessageRoutes'
import { ActivityRouteConfig } from './ActivityRoutes'
import { UsageTrackerRouteConfig } from './UsageTrackerRoutes'
import { AuthenticationRouteConfig } from './AuthenticationRoutes'
import { OAuth2RouteConfig } from './OAuth2Routes'
import { OAuth1RouteConfig } from './OAuth1Routes'
import { ExtensionRouteConfig } from './ExtensionRoutes'
import { AnalyticsRouteConfig } from './AnalyticsRoutes'
import { ExportRouteConfig } from './ExportRoutes'
import { ChatWithMeRouteConfig } from './ChatWithMeRoutes'
import { UserAppsRouteConfig } from './UserAppsRoutes'
import { ChecklistRoutesConfig } from './ChecklistRoutes'
import { ViewSettingsRouteConfig } from './ViewSettingsRoutes'
import { ProjectPersonalStructureRouteConfig } from "./ProjectPersonalStructureRoutes";

export const routesModule : ModuleLoaderType = (kernel, config) => {
  kernel.bind<RouteConfigInterface>(RoutesModule.OrganizationRoutes).to(OrganizationRouteConfig)
  kernel.bind<RouteConfigInterface>(RoutesModule.ProjectRoutes).to(ProjectRouteConfig)
  kernel.bind<RouteConfigInterface>(RoutesModule.ListRoutes).to(ListRouteConfig)
  kernel.bind<RouteConfigInterface>(RoutesModule.TaskRoutes).to(TaskRouteConfig)
  kernel.bind<RouteConfigInterface>(RoutesModule.ChecklistRoutes).to(ChecklistRoutesConfig)
  kernel.bind<RouteConfigInterface>(RoutesModule.UserRoutes).to(UserRouteConfig)
  kernel.bind<RouteConfigInterface>(RoutesModule.InternalRoutes).to(InternalRouteConfig)
  kernel.bind<RouteConfigInterface>(RoutesModule.NotificationRoutes).to(NotificationRouteConfig)
  kernel.bind<RouteConfigInterface>(RoutesModule.TagRoutes).to(TagRouteConfig)
  kernel.bind<RouteConfigInterface>(RoutesModule.FileRoutes).to(FileRouteConfig)
  kernel.bind<RouteConfigInterface>(RoutesModule.MessageRoutes).to(MessageRouteConfig)
  kernel.bind<RouteConfigInterface>(RoutesModule.ActivityRoutes).to(ActivityRouteConfig)
  kernel.bind<RouteConfigInterface>(RoutesModule.UsageTrackerRoutes).to(UsageTrackerRouteConfig)
  kernel.bind<RouteConfigInterface>(RoutesModule.AuthenticationRoutes).to(AuthenticationRouteConfig)
  kernel.bind<RouteConfigInterface>(RoutesModule.OAuth1Routes).to(OAuth1RouteConfig)
  kernel.bind<RouteConfigInterface>(RoutesModule.OAuth2Routes).to(OAuth2RouteConfig)
  kernel.bind<RouteConfigInterface>(RoutesModule.ExtensionRoutes).to(ExtensionRouteConfig)
  kernel.bind<RouteConfigInterface>(RoutesModule.AnalyticRoutes).to(AnalyticsRouteConfig)
  kernel.bind<RouteConfigInterface>(RoutesModule.ExportRoutes).to(ExportRouteConfig)
  kernel.bind<RouteConfigInterface>(RoutesModule.ChatWithMeRoutes).to(ChatWithMeRouteConfig)
  kernel.bind<RouteConfigInterface>(RoutesModule.UserAppsRoutes).to(UserAppsRouteConfig)
  kernel.bind<RouteConfigInterface>(RoutesModule.ViewSettingsRoutes).to(ViewSettingsRouteConfig)
  kernel.bind<RouteConfigInterface>(RoutesModule.ProjectPersonalStructureRoutes).to(ProjectPersonalStructureRouteConfig)
}
