import { LoggerInterface } from '../../../../infrastructure/logger'
import { TokenServiceInterface } from '../token/TokenServiceInterface';
import { injectable, inject } from 'inversify';
import { JsonWebToken } from '../token/JsonWebToken';
import { JwtParseStatus, TokenType } from '../token/types';
import { TokenModule } from '../token/TokenModule';
import { AuthenticationServiceInterface } from './AuthenticationServiceInterface';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule'
import AuthResult from './AuthResult'


@injectable()
class AuthenticationService
implements AuthenticationServiceInterface
{

  protected tokenService: TokenServiceInterface;
  protected logger: LoggerInterface;

  constructor(
    @inject(InfrastructureModule.LoggerInterface) logger: LoggerInterface,
    @inject(TokenModule.TokenServiceInterface) tokenService: TokenServiceInterface,
  ) {
    this.logger = logger;
    this.tokenService = tokenService;
  }

  getUserToken(id, url) { // TODO CR to nie powinno nazywac sie createUserToken ?? jest uzywane jako Create w usersController put userid
    try {
      const token = this.tokenService.createToken(TokenType.AUTHORIZATION, { sub: id });
      return JsonWebToken.CreateFromToken(token);
    } catch (error) {
      this.logger.error(error);
      return null
    }
  }

  getAuthResultFromToken(token: string): AuthResult {
    const tokenParseResult = this.tokenService.parseInternalJsonWebToken(
      TokenType.AUTHORIZATION,
      token
    );

    if (tokenParseResult.status !== JwtParseStatus.OK) {
      return new AuthResult(null);
    }

    const signedToken: any = tokenParseResult.token;

    if (!signedToken) {
      return new AuthResult(null)
    }

    return new AuthResult(signedToken.payload.sub);
  }
}

export default AuthenticationService
