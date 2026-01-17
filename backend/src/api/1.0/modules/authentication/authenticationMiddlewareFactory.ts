import AuthResult from './AuthResult';
import { Cookie } from '../common/enum'
import { MiddlewareHandler } from '../../../../infrastructure/RouteLoader'
import { AuthenticationServiceInterface } from './AuthenticationServiceInterface'
import { interfaces } from 'inversify'
import { AuthenticationModule } from './AuthenticationModule'

export const createAuthenticationMiddleware: interfaces.Factory<MiddlewareHandler> =
  (context: interfaces.Context) =>
  {
    const authService = context.container.get<AuthenticationServiceInterface>(AuthenticationModule.AuthenticationServiceInterface);
    return (req, res, next) =>
    {
      req.heyspace = req.heyspace || {}
      req.heyspace.authResult = req.cookies[ Cookie.AUTH_TOKEN ]
        ? authService.getAuthResultFromToken(req.cookies[ Cookie.AUTH_TOKEN ])
        : new AuthResult(null)
      ;
      next();
    }
  }
