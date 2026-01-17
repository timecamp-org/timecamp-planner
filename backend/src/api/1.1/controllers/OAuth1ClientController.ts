import { Request, Response } from 'express';

import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions';
import { inject, injectable } from 'inversify';
import { OAuth1Module } from '../modules/oauth1/OAuth1Module';
import { OAuth1ClientServiceInterface } from '../modules/oauth1/interfaces/OAuth1ClientServiceInterface';
import { InfrastructureModule } from '../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../infrastructure/logger';
import { OAuth1AuthorizedApplication } from '../modules/oauth1/types';

@injectable()
export class OAuth1ClientController {
  protected oauth1ClientService: OAuth1ClientServiceInterface;
  protected logger: LoggerInterface;

  constructor(
    @inject(OAuth1Module.OAuth1ClientServiceInterface)
    oauth1ClientService: OAuth1ClientServiceInterface,
    @inject(InfrastructureModule.LoggerInterface)
    logger: LoggerInterface
  ) {
    this.oauth1ClientService = oauth1ClientService;
    this.logger = logger;
  }

  async getAuthorizeUrlAction(req: Request, res: Response) {
    try {
      const currentUserId = req.heyspace.authResult.userId;
      const { apiKey, secret, pathToRedirectAfterAuthorization, organizationId } = req.query as unknown as {
        apiKey: string;
        secret: string;
        pathToRedirectAfterAuthorization: string;
        organizationId: string;
      };
      const { applicationName } = req.params;
      const url = await this.oauth1ClientService.getAuthorizeUrl(
        organizationId as unknown as string,
        currentUserId,
        applicationName as OAuth1AuthorizedApplication,
        apiKey,
        secret,
        pathToRedirectAfterAuthorization
      );
      res.send(url);
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async authorizeAction(req: Request, res: Response) {
    try {
      const currentUserId = req.heyspace.authResult.userId;
      const { oauthVerifier, oauthToken } = req.body;
      const { applicationName } = req.params;
      const { organizationId } = req.query;
      await this.oauth1ClientService.authorize(
        organizationId as unknown as string,
        currentUserId,
        applicationName as OAuth1AuthorizedApplication,
        oauthToken,
        oauthVerifier
      );
      res.send();
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getAuthorizedApplicationsAction(req: Request, res: Response) {
    try {
      const currentUserId = req.heyspace.authResult.userId;
      const { organizationId } = req.query;
      const applicationsAction = await this.oauth1ClientService.getAuthorizedApplications(
        organizationId as unknown as string,
        currentUserId
      );
      res.send(applicationsAction);
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async deauthorizeAction(req: Request, res: Response) {
    try {
      const currentUserId = req.heyspace.authResult.userId;
      const { applicationName } = req.params;
      const { organizationId } = req.query;
      await this.oauth1ClientService.deauthorize(
        organizationId as unknown as string,
        currentUserId,
        applicationName as OAuth1AuthorizedApplication
      );
      res.send();
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }
}
