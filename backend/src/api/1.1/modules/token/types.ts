import { JsonWebToken } from "./JsonWebToken";

export interface TokenPayloadInterface<T extends TokenType> {
  /**
   * Audience.
   */
  aud: string,

  /**
   * Issuer
   */
  iss: string,

  /**
   * Expiration time
   */
  exp: number,

  /**
   * Issued at (time)
   */
  iat: number,

  /**
   * Token type. This is not part of JWT specs, but we discriminate tokens by that.
   */
  typ: T,
}


export enum JwtParseStatus {
  OK,
  EXPIRED,
  MALFORMED
}

export interface JwtParseResult<T extends TokenType> {
  status: JwtParseStatus,
  token?: JsonWebToken<T>
}

export enum TokenType {
  AUTHORIZATION = 'auth',
  RESET_PASSWORD = 'rsPw',
}
