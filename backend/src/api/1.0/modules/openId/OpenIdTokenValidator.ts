import { get } from 'lodash'
import { OpenIdProviderFactory } from './OpenIdProviderFactory';
import { TokenServiceInterface } from '../token/TokenServiceInterface';
import { JsonWebToken } from '../token/JsonWebToken';
import { inject, injectable } from 'inversify';
import { TokenModule } from '../token/TokenModule';
import { ValidatedSubjectResult } from './types';
import { OpenIdProviderInterface } from './interfaces/OpenIdProviderInterface';

@injectable()
export default class OpenIdTokenValidator {
  protected tokenService: TokenServiceInterface;
  protected openIdProviderFactory: OpenIdProviderFactory;

  constructor(
    @inject(TokenModule.TokenServiceInterface) tokenService: TokenServiceInterface
  ) {
    this.openIdProviderFactory = new OpenIdProviderFactory(tokenService);
  }

  async getSubjectFromToken(token): Promise<ValidatedSubjectResult> {
    const jwt = JsonWebToken.DecodeToken(token);

    const issuer: string = get(jwt, 'payload.payload.iss');
    const providerKey: string = this.openIdProviderFactory.getProviderKey(issuer);
    const provider: OpenIdProviderInterface = this.openIdProviderFactory.getProvider(providerKey);

    return provider.getValidatedSubject(jwt);
  }

}
