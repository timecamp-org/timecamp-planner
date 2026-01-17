import { Request, Response } from 'express';
import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions';
import { Cookie, EntityStatus } from '../modules/common/enum';

import logger from '../../../infrastructure/logger';
import { GetUserFromTokenResultStatus } from '../modules/openId/types';
import { FrontendRoute } from '../../../config/frontendRoutes.config';
import { injectable, inject } from 'inversify';
import { CommonModule } from '../modules/common/CommonModule';
import { UrlGeneratorInterface } from '../modules/common/UrlGenerator';
import { UsersModule } from '../modules/users/UsersModule';
import { UserServiceInterface } from '../modules/users/UserServiceInterface';
import { AuthenticationServiceInterface } from '../modules/authentication/AuthenticationServiceInterface';
import { AuthenticationModule } from '../modules/authentication/AuthenticationModule';
import { OpenIdServiceInterface } from '../modules/openId/OpenIdServiceInterface';
import { OpenIdModule } from '../modules/openId/OpenIdModule';
import { AppleAuthServiceInterface } from '../modules/authentication/apple/AppleAuthServiceInterface';
import { AppleAuthenticationStatus } from '../modules/authentication/types';
import { configureCookie } from '../modules/authentication/helpers';

@injectable()
export class AuthenticationController {
  constructor(
    @inject(CommonModule.UrlGenerator)
    private urlGenerator: UrlGeneratorInterface,
    @inject(UsersModule.UserServiceInterface)
    private userService: UserServiceInterface,
    @inject(AuthenticationModule.AuthenticationServiceInterface)
    private authenticationService: AuthenticationServiceInterface,
    @inject(OpenIdModule.OpenIdServiceInterface)
    private openIdService: OpenIdServiceInterface,
    @inject(AuthenticationModule.AppleAuthServiceInterface)
    private appleAuthService: AppleAuthServiceInterface
  ) {}

  async loginWithPasswordAction(req: Request, res: Response) {
    try {
      const user = await this.userService.getUserByLoginAndPassword(req.body.login, req.body.password);
      if (!user) {
        return res.send(ErrorDefinitions[Type.UNAUTHORIZED]);
      }

      if (user.status === EntityStatus.DELETED) {
        return res.send(ErrorDefinitions[Type.ACCOUNT_DELETED]);
      }

      const token = this.authenticationService.getUserToken(user.id, req.get('host'));
      if (!token) {
        return res.send(ErrorDefinitions[Type.UNAUTHORIZED]);
      }

      const cookieName = Cookie.AUTH_TOKEN;
      return res.cookie(cookieName, token.tokenString, configureCookie(token.expiresAt)).status(200).send(user);
    } catch (error) {
      logger(error, { email: req.body.login as string });
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async loginWithOpenIdAction(req: Request, res: Response) {
    try {
      const userFromTokenResult = await this.openIdService.getUserFromToken(req.body.token);
      if (userFromTokenResult.status === GetUserFromTokenResultStatus.INVALID_ID_TOKEN) {
        return res.send(ErrorDefinitions[Type.INVALID_AUTH_TOKEN]);
      }
      if (userFromTokenResult.status === GetUserFromTokenResultStatus.ACCOUNT_DELETED) {
        return res.send(ErrorDefinitions[Type.ACCOUNT_DELETED]);
      }
      if (!userFromTokenResult.user) {
        return res.send(ErrorDefinitions[Type.UNAUTHORIZED]);
      }

      const token = this.authenticationService.getUserToken(userFromTokenResult.user.id, req.get('host'));
      if (!token) {
        return res.send(ErrorDefinitions[Type.UNAUTHORIZED]);
      }

      return res
        .cookie(Cookie.AUTH_TOKEN, token.tokenString, configureCookie(token.expiresAt))
        .status(200)
        .send(userFromTokenResult.user);
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async loginWithAppleAction(req: Request, res: Response) {
    try {
      const { body } = req;
      const { token } = body;

      const authResult = await this.appleAuthService.authenticate(token);

      switch (authResult.status) {
        case AppleAuthenticationStatus.INVALID_ID_TOKEN: {
          return res.send(ErrorDefinitions[Type.INVALID_AUTH_TOKEN]);
        }
        case AppleAuthenticationStatus.USER_NOT_FOUND: {
          return res.send(ErrorDefinitions[Type.UNAUTHORIZED]);
        }
        case AppleAuthenticationStatus.OK: {
          // OK
          break;
        }
        default: {
          return res.send(ErrorDefinitions[Type.INTERNAL]);
        }
      }

      const userToken = this.authenticationService.getUserToken(authResult.user.id, req.get('host'));
      if (!userToken) {
        return res.send(ErrorDefinitions[Type.UNAUTHORIZED]);
      }

      return res
        .cookie(Cookie.AUTH_TOKEN, userToken.tokenString, configureCookie(userToken.expiresAt))
        .status(200)
        .send(authResult.user);
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async redirectRegisterWithParams(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const url = this.urlGenerator.generate(FrontendRoute.REGISTER_WITH_MAIL, { email });
      return res.redirect(url);
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }
}

export default AuthenticationController;
