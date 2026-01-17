import { OpenIdConnect } from './OpenIdConnect';
import { OpenIdProviderCode } from '../common/enum';
import config from '../../../../config/index';
import { TokenServiceInterface } from '../token/TokenServiceInterface';
import { injectable, inject } from 'inversify';
import { TokenModule } from '../token/TokenModule';
import { OpenIdProviderInterface } from './interfaces/OpenIdProviderInterface';
import { OpenIdProviderFactoryInterface } from './interfaces/OpenIdProviderFactoryInterface';

@injectable()
export class OpenIdProviderFactory implements OpenIdProviderFactoryInterface {
  protected tokenService: TokenServiceInterface;

  constructor(
    @inject(TokenModule.TokenServiceInterface) tokenService: TokenServiceInterface
  ) {
    this.tokenService = tokenService;
  }

  getProviderKey(issuer: string): string {
    return config.openId.issuers[issuer];
  }

  getProvider(providerKey: string): OpenIdProviderInterface {
    const providerConfig = config.openId.providers[providerKey];
    switch (providerKey) {
      case OpenIdProviderCode.GOOGLE: return new OpenIdConnect(providerConfig, this.tokenService);
      default: throw new Error('Unimplemented provider type');
    }
  }
}
