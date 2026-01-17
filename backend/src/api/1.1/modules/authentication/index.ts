import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { AuthenticationModule } from './AuthenticationModule';
import { AuthenticationServiceInterface } from './AuthenticationServiceInterface';
import AuthenticationService from './AuthenticationService';
import { MiddlewareHandler } from '../../../../infrastructure/RouteLoader'
import { RestServerModule } from '../../../../infrastructure/restServer/RestServerModule'
import { createAuthenticationMiddleware } from './authenticationMiddlewareFactory'
import { AppleAuthServiceInterface } from './apple/AppleAuthServiceInterface';
import { AppleAuthService } from './apple/AppleAuthService'

export const authenticationModule : ModuleLoaderType = kernel => {
  kernel.bind<AuthenticationServiceInterface>(AuthenticationModule.AuthenticationServiceInterface).to(AuthenticationService);
  
  kernel.bind<MiddlewareHandler>(RestServerModule.RestMiddleware)
    .toFactory(createAuthenticationMiddleware);

  kernel.bind<AppleAuthServiceInterface>(AuthenticationModule.AppleAuthServiceInterface).to(AppleAuthService)
}
