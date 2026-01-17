import { OAuth1ClientServiceInterface } from './interfaces/OAuth1ClientServiceInterface';
import { injectable, inject } from 'inversify';
import { OAuth1Module } from './OAuth1Module';
import { OAuth1Config, OAuth1RequestTokenAndSecret, OAuth1AuthorizedApplication } from './types';
import { OAuth1AccessTokenProviderInterface } from './interfaces/OAuth1AccessTokenProviderInterface';
import { OAuth1ApiKeyProviderInterface } from './interfaces/OAuth1ApiKeyProviderInterface';
import { OAuth1RequestTokenProviderInterface } from './interfaces/OAuth1RequestTokenProviderInterface';
import { Id } from '../common/identifier';
import { UrlGeneratorInterface } from '../common/UrlGenerator';
import { CommonModule } from '../common/CommonModule';
import { OAuth1ClientProviderInterface } from './interfaces/OAuth1ClientProviderInterface';
import { OAuth1ClientInterface } from './interfaces/OAuth1ClientInterface';

const appName = 'HeySpace';

@injectable()
export class OAuth1ClientService implements OAuth1ClientServiceInterface {

  private config: OAuth1Config;
  protected urlGenerator: UrlGeneratorInterface;
  protected oauth1ClientProvider: OAuth1ClientProviderInterface;
  private oauth1AccessTokenProvider: OAuth1AccessTokenProviderInterface;
  private oauth1ApiKeyProvider: OAuth1ApiKeyProviderInterface;
  private oauth1RequestTokenProvider: OAuth1RequestTokenProviderInterface;
  private oauth1Client: OAuth1ClientInterface;

  constructor(
    @inject(OAuth1Module.OAuth1Config) config: OAuth1Config,
    @inject(CommonModule.UrlGenerator) urlGenerator: UrlGeneratorInterface,
    @inject(OAuth1Module.OAuth1ClientProviderInterface) oauth1ClientProvider: OAuth1ClientProviderInterface,
    @inject(OAuth1Module.OAuth1AccessTokenProviderInterface) oauth1AccessTokenProvider: OAuth1AccessTokenProviderInterface,
    @inject(OAuth1Module.OAuth1ApiKeyProviderInterface) oauth1ApiKeyProvider: OAuth1ApiKeyProviderInterface,
    @inject(OAuth1Module.OAuth1RequestTokenProviderInterface) oauth1RequestTokenProvider: OAuth1RequestTokenProviderInterface,
    @inject(OAuth1Module.OAuth1ClientInterface) oauth1Client: OAuth1ClientInterface,
  ) {
    this.config = config
    this.urlGenerator = urlGenerator
    this.oauth1ClientProvider = oauth1ClientProvider
    this.oauth1AccessTokenProvider = oauth1AccessTokenProvider
    this.oauth1ApiKeyProvider = oauth1ApiKeyProvider
    this.oauth1RequestTokenProvider = oauth1RequestTokenProvider
    this.oauth1Client = oauth1Client
  }

  async getOAuth1RequestTokens(
    applicationName: OAuth1AuthorizedApplication,
    apiKey: string,
    secret: string,
    pathToRedirectAfterAuthorization: string,
  ): Promise<OAuth1RequestTokenAndSecret> {
    const { requestURL, accessURL } = this.config[applicationName]
    const urlToRedirectAfterAuthorization = this.urlGenerator.generateFromRoute({ path: pathToRedirectAfterAuthorization })
    return this.oauth1Client.getOAuthRequestToken(requestURL, accessURL, apiKey, secret, urlToRedirectAfterAuthorization)
  }

  async getAuthorizeUrl(
    organizationId: Id,
    userId: Id,
    applicationName: OAuth1AuthorizedApplication,
    apiKey: string,
    secret: string,
    pathToRedirectAfterAuthorization: string,
  ): Promise<string> {
    const { requestToken, requestTokenSecret } = await this.getOAuth1RequestTokens(applicationName, apiKey, secret, pathToRedirectAfterAuthorization)
    const client = await this.oauth1ClientProvider.getClientByApplicationName(applicationName)
    if (!client) {
      throw new Error(`${applicationName} client not found`)
    }

    await this.oauth1RequestTokenProvider.createOrUpdateTokenAndSecret(organizationId, userId, client.id, requestToken, requestTokenSecret)
    await this.oauth1ApiKeyProvider.createOrUpdateApiKeyAndSecret(organizationId, userId, client.id, apiKey, secret)

    const { authorizeURL } = this.config[applicationName]
    return `${authorizeURL}?oauth_token=${requestToken}&name=${appName}&expiration=never`
  }

  async getOAuth1ProtectedResource(
    applicationName: OAuth1AuthorizedApplication,
    organizationId: Id,
    userId: Id,
    resourceUrl: string,
  ): Promise<any> {
    const client = await this.oauth1ClientProvider.getClientByApplicationName(applicationName)
    if (!client) {
      throw new Error(`${applicationName} client not found`)
    }

    const { accessToken, accessTokenSecret } = await this.oauth1AccessTokenProvider.getTokenAndSecret(organizationId, userId, client.id)
    const { apiKey, secret } = await this.oauth1ApiKeyProvider.getApiKeyAndSecret(organizationId, userId, client.id)

    const { requestURL, accessURL } = this.config[applicationName]

    return await this.oauth1Client.getOAuth1ProtectedResource(requestURL, accessURL, apiKey, secret, accessToken, accessTokenSecret, resourceUrl)
  }

  async authorize(
    organizationId: Id,
    userId: Id,
    applicationName: OAuth1AuthorizedApplication,
    requestToken: string,
    verifier: string,
  ): Promise<void> {
    const client = await this.oauth1ClientProvider.getClientByApplicationName(applicationName)
    if (!client) {
      throw new Error(`${applicationName} client not found`)
    }

    const { apiKey, secret } = await this.oauth1ApiKeyProvider.getApiKeyAndSecret(organizationId, userId, client.id)
    const { requestTokenSecret } = await this.oauth1RequestTokenProvider.getTokenAndSecret(organizationId, userId, client.id)

    const { requestURL, accessURL } = this.config[applicationName]
    const { accessToken, accessTokenSecret } = await this.oauth1Client.getOAuth1AccessTokens(requestURL, accessURL, apiKey, secret, requestToken, requestTokenSecret, verifier)

    await this.oauth1AccessTokenProvider.createOrUpdateTokenAndSecret(organizationId, userId, client.id, accessToken, accessTokenSecret)
  }

  async getAuthorizedApplications(
    organizationId: Id,
    userId: Id,
  ): Promise<string[]> {
    const clientIds = await this.oauth1AccessTokenProvider.getClientIdsWithAccessToken(organizationId, userId)

    const applicationNamesByIds = await this.oauth1ClientProvider.getApplicationNamesByIds(clientIds)

    return Object.values(applicationNamesByIds)
  }

  async deauthorize(
    organizationId: Id,
    userId: Id,
    applicationName: OAuth1AuthorizedApplication,
  ): Promise<void> {
    const client = await this.oauth1ClientProvider.getClientByApplicationName(applicationName)
    if (!client) {
      throw new Error(`${applicationName} client not found`)
    }

    await this.oauth1AccessTokenProvider.removeTokenAndSecret(organizationId, userId, client.id)
  }

}
