import * as jwt from 'jsonwebtoken'

import { TokenPayloadInterface, TokenType } from './types';
import config from '../../../../config';

export class JsonWebToken<T extends TokenType> {
  constructor(token: TokenPayloadInterface<T>, signed: string, expiresAt: Date) {
    this.payload = token;
    this.expiresAt = expiresAt;
    this.tokenString = signed;
  }

  readonly payload: TokenPayloadInterface<T>;
  readonly tokenString: string;
  readonly expiresAt: Date

  public get(param: string, defaultValue: any): any {
    if (this.payload && this.payload[param]) {
      return this.payload[param];
    } else {
      return defaultValue;
    }
  }

  public static CreateFromToken<T extends TokenType>(payload: TokenPayloadInterface<T>): JsonWebToken<T> {
    const signed = jwt.sign(
      payload,
      config.jwt.secret,
      { algorithm: config.jwt.algorithm },
    );

    return new JsonWebToken<T>(
      payload,
      signed,
      new Date(payload.exp * 1000)
    )
  }

  public static ParseToken<T extends TokenType>(tokenString: string, secret: string = config.jwt.secret, algorithm: jwt.Algorithm = config.jwt.algorithm): JsonWebToken<T> {
    const tokenPayload = <TokenPayloadInterface<T>>jwt.verify(
      tokenString,
      secret,
      { algorithms: [algorithm] }
    );
    return new JsonWebToken(tokenPayload, tokenString, new Date(tokenPayload.exp * 1000));
  }

  public static ParseInternalToken<T extends TokenType>(tokenType: T, tokenString: string, secret: string = config.jwt.secret, algorithm: jwt.Algorithm = config.jwt.algorithm): JsonWebToken<T> {
    const jwt: JsonWebToken<T> = this.ParseToken(tokenString, secret, algorithm);
    if (jwt.payload && jwt.payload.typ && jwt.payload.typ === tokenType) {
      return jwt;
    } else {
      return null;
    }
  }

  public static DecodeToken<T extends TokenType>(tokenString: string): JsonWebToken<T> {
    const tokenPayload = <TokenPayloadInterface<T>>jwt.decode(tokenString, { complete: true });
    return new JsonWebToken(tokenPayload, tokenString, new Date(tokenPayload.exp * 1000));
  }
}
