import { OAuth2ProviderServiceInterface } from './interfaces/OAuth2ProviderServiceInterface';
import { injectable, inject } from 'inversify';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { OAuthDataProviderInterface } from './interfaces/OAuthDataProviderInterface';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { OAuth2Module } from './OAuth2Module';
import { pick } from 'lodash'
import { GetBasicClientDataResult, GetBasicClientDataStatus, RegenerateClientSecretResult, RegenerateClientSecretStatus } from './types';
import { CommonModule } from '../common/CommonModule';
import { Id, IdGeneratorInterface } from '../common/identifier';
import { randomBytes } from 'crypto'

@injectable()
export class OAuth2ProviderService implements OAuth2ProviderServiceInterface {

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    protected logger: LoggerInterface,
    @inject(OAuth2Module.OAuthDataProviderInterface)
    private oauthDataProvider: OAuthDataProviderInterface,
    @inject(CommonModule.IdGeneratorInterface)
    private idGenerator: IdGeneratorInterface<Id>,
  ) { }

  async getBasicClientData(clientId: string): Promise<GetBasicClientDataResult> {
    const result = await this.oauthDataProvider.getClient(clientId)
    if (!result) {
      return {
        status: GetBasicClientDataStatus.OAUTH_CLIENT_NOT_FOUND
      }
    }

    return {
      status: GetBasicClientDataStatus.OK,
      client: pick(result, ['name', 'id', 'thumbnailUrl']),
    }
  }

  async regenerateClientSecret(clientId: string): Promise<RegenerateClientSecretResult> {
    const clientSecret = this.generateClientSecret()
    await this.oauthDataProvider.updateClient(clientId, { clientSecret })
    return {
      status: RegenerateClientSecretStatus.OK,
      clientSecret: clientSecret,
    }
  }

  generateClientSecret(): string {
    const id = this.idGenerator.generateId()
    return randomBytes(Math.ceil(id.length / 2))
      .toString('hex')
      .slice(0, id.length)
  }
}
