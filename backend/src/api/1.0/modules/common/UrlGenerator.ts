import { LoggerInterface } from '../../../../infrastructure/logger'
import { injectable, inject } from 'inversify';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { CommonModule } from './CommonModule';

const PARAM_REGEX = /{([a-z0-9_-]+)}/gi;
export type RouteDefinition = {
  /**
   * Url pattern. Parameters are moustached, eg.:
   * /task/{taskId}
   */
  path: string,
  basePath?: string,
}

export type RouteParameters = {
  [paramName: string] : string
}

export type RoutesDictionary = {
  [name: string]: RouteDefinition
}

export type UrlGeneratorOptions = {
  basePath: string,
  defaultParameters?: RouteParameters
}

export interface UrlGeneratorInterface
{
  generate(routeName: string, params?: RouteParameters): string

  generateFromRoute(route: RouteDefinition, params?: RouteParameters): string
}

@injectable()
export class UrlGenerator
implements UrlGeneratorInterface
{
  protected routes : RoutesDictionary;
  protected basePath: string;
  protected defaultParameters?: RouteParameters;
  protected logger: LoggerInterface

  constructor(
    @inject(InfrastructureModule.LoggerInterface) logger: LoggerInterface,
    @inject(CommonModule.UrlGeneratorOptions) params: UrlGeneratorOptions, 
    @inject(CommonModule.RoutesDictionary) routes?: RoutesDictionary
  ) {
    this.basePath = params.basePath;
    this.defaultParameters = params.defaultParameters || {};
    this.logger = logger;
    this.routes = routes || {};
  }
  
  addRoute(name: string, definition: RouteDefinition) {
    this.routes[name] = definition;
  }

  /**
   * Replaces parameters in {brackets} with keys provided as param.brackets
   * @param {string} routeName
   * @param {RouteParameters} params
   * @return {any}
   */
  generate(routeName: string, params?: RouteParameters): string {
    if (!this.routes[routeName]) {
      this.logger.error(`Cannot find route: [${routeName}]`);
      return null;
    }
    const routeDefinition = this.routes[routeName];
    
    return this.generateFromRoute(routeDefinition, params)
  }

  generateFromRoute(route: RouteDefinition, params?: RouteParameters): string {
    const thisParams = Object.assign({}, this.defaultParameters, params || {});
    const basePath = route.basePath || this.basePath
    const pathPattern = basePath + route.path
    
    const path = pathPattern.replace(
      PARAM_REGEX,
      (match, ...groups) => {
        const paramName = groups[0];
        if (!thisParams[paramName]) {
          this.logger.error(`Parameter [${paramName}] not provided for route [${route}]`);
          return '';
        }
        return encodeURIComponent(thisParams[paramName]);
      }
    );
    
    return path;
  }
}
