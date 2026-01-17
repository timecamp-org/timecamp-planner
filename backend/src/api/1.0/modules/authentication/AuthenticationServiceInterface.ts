import { JsonWebToken } from "../token/JsonWebToken";
import { TokenType } from "../token/types";
import AuthResult from './AuthResult'

export interface AuthenticationServiceInterface {
  getUserToken(id, url): JsonWebToken<TokenType.AUTHORIZATION>;
  getAuthResultFromToken(token: string): AuthResult;
}
