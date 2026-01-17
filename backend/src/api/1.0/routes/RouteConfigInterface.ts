import { PathConfig, RouteConfig } from '../../../infrastructure/RouteLoader';

export interface RouteConfigInterface {
  getPathConfig?(): PathConfig
  getRouteConfig?(): RouteConfig
}
