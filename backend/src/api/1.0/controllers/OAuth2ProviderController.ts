import { LoggerInterface } from '../../../infrastructure/logger';
import { inject, injectable } from 'inversify';
import { InfrastructureModule } from '../../../infrastructure/InfrastructureModule';

import * as OAuthServer from 'oauth2-server';
import { Request, Response } from 'express';
import { OAuth2Module } from '../modules/oauth2/OAuth2Module';
import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions';
import { OAuthResponse } from '../modules/oauth2/OAuthResponse';
import { OAuth2ProviderServiceInterface } from '../modules/oauth2/interfaces/OAuth2ProviderServiceInterface';
import { GetBasicClientDataStatus, RegenerateClientSecretStatus } from '../modules/oauth2/types';

@injectable()
export class OAuth2ProviderController {
  protected logger: LoggerInterface;
  private oAuth2Server: OAuthServer;
  private oauth2ProviderService: OAuth2ProviderServiceInterface;

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    logger: LoggerInterface,
    @inject(OAuth2Module.OAuth2Server)
    oAuth2Server: OAuthServer,
    @inject(OAuth2Module.OAuth2ProviderServiceInterface)
    oauth2ProviderService: OAuth2ProviderServiceInterface
  ) {
    this.logger = logger;
    this.oAuth2Server = oAuth2Server;
    this.oauth2ProviderService = oauth2ProviderService;
  }

  public async getTokenAction(req: Request, res: Response) {
    const request = new OAuthServer.Request(req);
    const response = new OAuthServer.Response(res);
    try {
      await this.oAuth2Server.token(request, response);
      const { access_token, expires_in, refresh_token, token_type } = response.body;
      const body = new OAuthResponse(access_token, refresh_token, expires_in, token_type);
      return res.send(body);
    } catch (error) {
      this.logger.error(error);
      return res.send(error);
    }
  }

  public async authorizeAction(req: Request, res: Response) {
    const request = new OAuthServer.Request(req);
    const response = new OAuthServer.Response(res);
    try {
      const result = await this.oAuth2Server.authorize(request, response);
      return res.send(result);
    } catch (error) {
      this.logger.error(error);
      return res.send(error);
    }
  }

  public async getClientInfoAction(req: Request, res: Response) {
    try {
      const { clientId } = req.params;
      const result = await this.oauth2ProviderService.getBasicClientData(clientId);

      switch (result.status) {
        case GetBasicClientDataStatus.OK:
          return res.send(result.client);
        case GetBasicClientDataStatus.OAUTH_CLIENT_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.RESOURCE_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  public async regenerateSecret(req: Request, res: Response) {
    try {
      const { clientId } = req.params;
      const result = await this.oauth2ProviderService.regenerateClientSecret(clientId);

      switch (result.status) {
        case RegenerateClientSecretStatus.OK:
          return res.send(result);
        case RegenerateClientSecretStatus.OAUTH_CLIENT_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.RESOURCE_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }
}
