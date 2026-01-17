import config from "../../../../config";
import { JsonWebTokenError, TokenExpiredError, Algorithm } from 'jsonwebtoken'
import { TimeServiceInterface } from '../common/time/TimeServiceInterface';
import { JsonWebToken } from './JsonWebToken';
import { JwtParseStatus, TokenType, TokenPayloadInterface, JwtParseResult } from './types';
import { TokenServiceInterface } from './TokenServiceInterface';
import { injectable, inject } from "inversify";
import { CommonModule } from "../common/CommonModule";

@injectable()
export class TokenService implements TokenServiceInterface {

  protected timeService: TimeServiceInterface;

  constructor(
    @inject(CommonModule.TimeServiceInterface) timeService: TimeServiceInterface
  ) {
    this.timeService = timeService
  }

  createJsonWebToken<T extends TokenType>(payload: TokenPayloadInterface<T>) {
    return JsonWebToken.CreateFromToken(payload);
  }

  parseJsonWebToken<T extends TokenType>(tokenString: string, secret?: string, algorithm?: Algorithm): JwtParseResult<T> {
    try {
      return {
        status: JwtParseStatus.OK,
        token: JsonWebToken.ParseToken(tokenString, secret, algorithm)
      };
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        return { status: JwtParseStatus.EXPIRED };
      } else if (e instanceof JsonWebTokenError) {
        return { status: JwtParseStatus.MALFORMED };
      } else {
        throw e;
      }
    }
  }

  parseInternalJsonWebToken<T extends TokenType>(tokenType: T, tokenString: string, secret?: string, algorithm?: Algorithm): JwtParseResult<T> {
    try {
      return {
        status: JwtParseStatus.OK,
        token: JsonWebToken.ParseInternalToken(tokenType, tokenString, secret, algorithm)
      };
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        return { status: JwtParseStatus.EXPIRED };
      } else if (e instanceof JsonWebTokenError) {
        return { status: JwtParseStatus.MALFORMED };
      } else {
        throw e;
      }
    }
  }

  createToken<T extends TokenType>(type: T, payload: object): TokenPayloadInterface<T> {
    let currentTimestamp = this.timeService.getCurrentEpoch();
    return {
      ...payload,

      typ: type,
      aud: config.jwt.issuer,
      iss: config.jwt.issuer,
      iat: currentTimestamp,
      exp: currentTimestamp + config.jwt.defaultTtl,
    };
  }
}
