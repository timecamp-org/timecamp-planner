import { IRouter, IRoute, Request, Response } from 'express';
import * as _ from 'lodash'


export type RouteHandler = (req: Request, res: Response) => any;
export type MiddlewareHandler = (req: any, res: any, next?: any) => any;
export type RouterFactory = () => IRouter;


export type RouteConfig = {
  [pathName: string]: PathConfig
}
export type PathConfig = RouteDefinition | SubRouteConfig ;

export type RouteDefinition = RouteHandler | RouteHandlerConfig;

export type SubRouteConfig = {
  use?: MiddlewareConfig,

  // [method: RouteMethods]: RouteDefinition,
  all?: RouteDefinition,
  get?: RouteDefinition,
  put?: RouteDefinition,
  post?: RouteDefinition,
  patch?: RouteDefinition,
  delete?: RouteDefinition,

  paths?: RouteConfig
}
export type RouteMethods = Exclude<keyof SubRouteConfig, 'use' | 'paths'>

export type RouteHandlerConfig = {
  use: MiddlewareConfig,
  action: RouteHandler,
};
export type MiddlewareConfig = MiddlewareHandler[]


export class RouteLoader
{
  protected routeFactory: RouterFactory

  constructor(routeFactory: RouterFactory) {
    this.routeFactory = routeFactory
  }

  parseConfig(config: RouteConfig): IRouter {
    const router = this.routeFactory();

    const paths = Object.keys(config);

    for (const pathName of paths)
    {
      const pathConfig = config[ pathName ];
      this.parsePathConfig(router, pathName, pathConfig);
    }

    return router;
  }

  private parsePathConfig(router: IRouter, pathName: string, pathConfig: PathConfig) {
    
    if (this.parseRouteDefinition(router.route(pathName), 'get', <RouteDefinition>pathConfig)) {
      // SubRouteConfig or RouteHandlerConfig
      return;
    }

    // SubRouteConfig
    this.parseSubRouteConfig(router, pathName, <SubRouteConfig>pathConfig);
  }

  private parseRouteDefinition(route: IRoute, method: string, routeDefinition: RouteDefinition) : boolean {
    if (routeDefinition instanceof Function) {
      // RouteHandler
      route[method](routeDefinition);
      return true;
    } else if (_.has(routeDefinition, 'action')) {
      // RouteHandlerConfig
      const middlewares = (routeDefinition as RouteHandlerConfig).use;
      const handler = (routeDefinition as RouteHandlerConfig).action;
      route[method](...middlewares, handler);
      return true;
    }
    return false;
  }

  private parseSubRouteConfig(router: IRouter, pathName: string, config: SubRouteConfig) {
    const methods = [ 'get', 'put', 'post', 'delete', 'patch' ];
    const middlewares = config.use || [];
    if (middlewares) {
      for (const middleware of middlewares) {
        router.use(pathName, middleware);
      }
    }
    for (const method of methods) {
      if (config[ method ]) {
        this.parseRouteDefinition(router.route(pathName), method, config[method]);
      }
    }
    
    if (config.paths) {
      const subRouter = this.parseConfig(config.paths);
      router.use(pathName, subRouter);
    }
  }
}
