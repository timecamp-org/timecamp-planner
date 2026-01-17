import { RoutesDictionary } from '../api/1.0/modules/common/UrlGenerator';

export const marketingSiteBaseUrl = 'https://www.timecamp.com/planner';
export const fallbackAppBaseUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:3002';
export const mapsUSAHQUrl =
  'https://www.google.com/maps/place/340+S+Lemon+Ave,+Walnut,+CA+91789,+USA/@34.0118656,-117.8602402,19';

export enum FrontendRoute {
  HOME = 'home',
  FEATURES = 'features',
  LOGIN = 'login',
  REGISTER = 'register',
  REGISTER_WITH_MAIL = 'register_with_mail',
  RESET_PASSWORD = 'reset-password',
  NOTIFICATION_SETTINGS = 'notification-settings',

  TASK = 'task',
  TASK_IN_PROJECT = 'task-in-project',
  TASK_IN_KANBAN = 'task-in-kanban',

  PROJECT = 'project',
  KANBAN = 'kanban',
}

const frontendRoutes: RoutesDictionary = {
  [FrontendRoute.HOME]: { path: '/' },
  [FrontendRoute.FEATURES]: { path: '/features', basePath: marketingSiteBaseUrl },
  [FrontendRoute.REGISTER]: { path: '/register?token={token}&email={email}', basePath: fallbackAppBaseUrl },
  [FrontendRoute.REGISTER_WITH_MAIL]: { path: '/register?email={email}', basePath: fallbackAppBaseUrl },
  [FrontendRoute.LOGIN]: { path: '/login', basePath: fallbackAppBaseUrl },
  [FrontendRoute.RESET_PASSWORD]: { path: '/changePassword?token={token}', basePath: fallbackAppBaseUrl },
  [FrontendRoute.NOTIFICATION_SETTINGS]: { path: '/settings/notifications' },

  [FrontendRoute.TASK]: { path: '/?taskId={taskId}' },
  [FrontendRoute.TASK_IN_PROJECT]: { path: '/projects/{projectId}/chat/tasks?taskId={taskId}' },
  [FrontendRoute.TASK_IN_KANBAN]: { path: '/projects/{projectId}/kanban?taskId={taskId}' },

  [FrontendRoute.PROJECT]: { path: '/projects/{projectId}/chat/tasks' },
  [FrontendRoute.KANBAN]: { path: '/projects/{projectId}/kanban' },
};

export default frontendRoutes;
