import { injectable, inject } from 'inversify';
import { AuthorizationCode, Client, User, Falsey, Token, RefreshToken } from 'oauth2-server';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { UserServiceInterface } from '../users/UserServiceInterface';
import { OAuthDataProviderInterface } from './interfaces/OAuthDataProviderInterface';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { UsersModule } from '../users/UsersModule';
import { OAuth2Module } from './OAuth2Module';
import { OAuthAuthorizationCode } from './types';
import { AuthorizationModelInterface } from './interfaces/AuthorizationModelInterface';

@injectable()
export class PostgresqlAuthorizationModel implements AuthorizationModelInterface {
  private logger: LoggerInterface;
  private userService: UserServiceInterface;
  private oAuthDataProvider: OAuthDataProviderInterface;

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    logger: LoggerInterface,
    @inject(UsersModule.UserServiceInterface)
    userService: UserServiceInterface,
    @inject(OAuth2Module.OAuthDataProviderInterface)
    oAuthDataProvider: OAuthDataProviderInterface
  ) {
    this.logger = logger;
    this.userService = userService;
    this.oAuthDataProvider = oAuthDataProvider;
  }

  /*
   * RequestAuthenticationModel
   */
  async getAccessToken(bearerToken: string): Promise<Token | Falsey> {
    const accessToken = await this.oAuthDataProvider.getAccessToken(bearerToken);
    if (!accessToken) {
      return null;
    }
    const client = await this.oAuthDataProvider.getClient(accessToken.clientId);
    const user = await this.userService.getUserById(accessToken.userId);
    const grants = client.grants.split(' ');
    const redirectUris = client.redirectUris.split(' ');
    return {
      accessToken: accessToken.accessToken,
      accessTokenExpiresAt: accessToken.expiresAt,
      client: {
        id: client.id,
        grants,
        redirectUris,
        accessTokenLifetime: client.accessTokenLifetime,
        refreshTokenLifetime: client.refreshTokenLifetime,
      },
      scope: accessToken.scope,
      user,
    };
  }

  /*
   * RequestAuthenticationModel
   */
  async verifyScope(accessToken: Token, scope: string): Promise<boolean> {
    if (!accessToken.scope) {
      return false;
    }
    const requestedScopes = scope.split(' ');
    let authorizedScopes = [];

    if (Array.isArray(accessToken.scope)) {
      authorizedScopes = accessToken.scope;
    } else {
      authorizedScopes = accessToken.scope.split(' ');
    }
    return requestedScopes.every((s) => authorizedScopes.indexOf(s) >= 0);
  }

  async getRefreshToken(bearerToken: string): Promise<RefreshToken> {
    const refreshToken = await this.oAuthDataProvider.getRefreshToken(bearerToken);
    if (!refreshToken) {
      return null;
    }
    const client = await this.oAuthDataProvider.getClient(refreshToken.clientId);
    const user = await this.userService.getUserById(refreshToken.userId);
    return {
      refreshToken: refreshToken.refreshToken,
      client,
      refreshTokenExpiresAt: refreshToken.expiresAt,
      scope: refreshToken.scope,
      user,
    };
  }

  async getAuthorizationCode(authorizationCode: string): Promise<AuthorizationCode | Falsey> {
    const code = await this.oAuthDataProvider.getAuthorizationCode(authorizationCode);
    if (!code) {
      return null;
    }
    const client = await this.oAuthDataProvider.getClient(code.clientId);
    const user = await this.userService.getUserById(code.userId);
    const grants = client.grants.split(' ');
    const redirectUris = client.redirectUris.split(' ');
    return {
      authorizationCode: code.authorizationCode,
      expiresAt: code.expiresAt,
      redirectUri: code.redirectUri,
      client: {
        id: client.id,
        grants,
        redirectUris,
        accessTokenLifetime: client.accessTokenLifetime,
        refreshTokenLifetime: client.refreshTokenLifetime,
      },
      scope: code.scope,
      user,
    };
  }

  async getClient(clientId: string, clientSecret: string): Promise<Client> {
    const client = await this.oAuthDataProvider.getClient(clientId, clientSecret);
    if (!client) {
      return null;
    }
    const grants = client.grants.split(' ');
    const redirectUris = client.redirectUris.split(' ');
    return {
      accessTokenLifetime: client.accessTokenLifetime,
      grants,
      id: client.id,
      redirectUris,
      refreshTokenLifetime: client.refreshTokenLifetime,
    };
  }

  async saveToken(token: Token, client: Client, user: User): Promise<Token | Falsey> {
    try {
      let scope = token.scope;
      if (Array.isArray(scope)) {
        scope = scope.join(' ');
      }
      await this.oAuthDataProvider.createAccessToken(
        token.accessToken,
        client.id,
        user.id,
        token.accessTokenExpiresAt,
        scope
      );
      await this.oAuthDataProvider.createRefreshToken(
        token.refreshToken,
        client.id,
        user.id,
        token.refreshTokenExpiresAt,
        scope
      );

      this.logger.debug('Token saved', token, client, user);

      const accessToken = {
        client,
        user,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      };
      return accessToken;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async saveAuthorizationCode(
    code: AuthorizationCode,
    client: Client,
    user: User
  ): Promise<AuthorizationCode | Falsey> {
    const authorizationCode: OAuthAuthorizationCode = {
      authorizationCode: code.authorizationCode,
      expiresAt: code.expiresAt,
      redirectUri: code.redirectUri,
      scope: code.scope,
    };
    await this.oAuthDataProvider.createAuthorizationCode(authorizationCode, client.id, user.id);
    return {
      authorizationCode: code.authorizationCode,
      client,
      user,
      expiresAt: code.expiresAt,
      redirectUri: code.redirectUri,
      scope: code.scope,
    };
  }

  async revokeAuthorizationCode(code: AuthorizationCode): Promise<boolean> {
    try {
      await this.oAuthDataProvider.deleteAuthorizationCode(code.authorizationCode);
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  async revokeToken(token: RefreshToken | Token): Promise<boolean> {
    try {
      await this.oAuthDataProvider.deleteRefreshToken(token.refreshToken);
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
