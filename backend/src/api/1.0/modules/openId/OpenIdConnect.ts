import { JwtParseResult, JwtParseStatus, TokenType } from "../token/types";
import { get } from 'lodash'
import { OpenIdProviderCode } from "../common/enum";
import { JsonWebToken } from "../token/JsonWebToken";
import { TokenServiceInterface } from "../token/TokenServiceInterface";
import { inject, injectable } from "inversify";
import { TokenModule } from "../token/TokenModule";
import { OpenIdProviderInterface } from "./interfaces/OpenIdProviderInterface";
import { OpenIdConnectConfigInterface, TokenHeader, SigningKeyInterface, ValidatedSubjectResult, ValidatedSubjectResultStatus } from "./types";
// this package cannot be imported via es6 import
const jwksClient = require('jwks-rsa');


/*
 * Google OpenIdConnect implementation
 */
@injectable()
export class OpenIdConnect implements OpenIdProviderInterface {

  protected config: OpenIdConnectConfigInterface;
  protected tokenService: TokenServiceInterface;
  protected jwksClient;

  constructor(
    config: OpenIdConnectConfigInterface, 
    @inject(TokenModule.TokenServiceInterface) tokenService: TokenServiceInterface,
  ) {
    this.config = config
    this.tokenService = tokenService;
    this.jwksClient = jwksClient({
      cache: true,
      rateLimit: true,
      strictSsl: true,
      jwksUri: config.jwksUri,
    });
  }


  async getValidatedSubject<T extends TokenType>(jwt: JsonWebToken<T>): Promise<ValidatedSubjectResult> {
    const tokenHeader: TokenHeader = get(jwt, 'payload.header')
    const signingKey: SigningKeyInterface = await this.getSigningKey(tokenHeader.kid)
    const parseTokenResult: JwtParseResult<T> = this.tokenService.parseJsonWebToken(jwt.tokenString, signingKey.rsaPublicKey, tokenHeader.alg)

    const audience = get(parseTokenResult, 'token.payload.aud');

    if (parseTokenResult.status !== JwtParseStatus.OK || audience !== this.config.clientId) {
      return { status: ValidatedSubjectResultStatus.INVALID_ID_TOKEN }
    }

    const subjectId = get(parseTokenResult, 'token.payload.sub', '');
    const name = get(parseTokenResult, 'token.payload.name', '');
    const email = get(parseTokenResult, 'token.payload.email', '');

    return {
      status: ValidatedSubjectResultStatus.OK,
      subject: {
        subjectId: subjectId.trim(),
        name: name.trim(),
        email: email.trim(),
        providerCode: OpenIdProviderCode.GOOGLE,
      }
    }
  }

  getSigningKey(kid): Promise<SigningKeyInterface> {
    return new Promise((resolve, reject) => {
      this.jwksClient.getSigningKey(kid, (error, key) => {
        if (error) {
          return reject(error);
        }
        return resolve(key);
      })
    })
  }
}
