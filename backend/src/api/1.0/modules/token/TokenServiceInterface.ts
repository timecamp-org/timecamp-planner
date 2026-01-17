import { TokenType, TokenPayloadInterface, JwtParseResult } from "./types";
import { JsonWebToken } from "./JsonWebToken";

export interface TokenServiceInterface {
  createToken<T extends TokenType>(type: T, payload: object): TokenPayloadInterface<T>,

  createJsonWebToken<T extends TokenType>(token: TokenPayloadInterface<T>): JsonWebToken<T>,

  /*
  * Parse tokens according to JWT specs
  */
  parseJsonWebToken<T extends TokenType>(tokenString: string, secret?: string, algorithm?: string): JwtParseResult<T>,
  
  /*
  * Parse custom generated tokens with type
  */
  parseInternalJsonWebToken<T extends TokenType>(tokenType: T, tokenString: string, secret?: string, algorithm?: string): JwtParseResult<T>,
}
