import { Id } from '../../common/identifier';
import { AppleAuthenticationResult, CreateUserFromAppleTokenResult } from '../types';

export interface AppleAuthServiceInterface {
  authenticate(identityToken: string): PromiseLike<AppleAuthenticationResult>
  createUserFromToken(userId: Id, identityToken: string, firstName: string, lastName: string, ipAddress: string): PromiseLike<CreateUserFromAppleTokenResult>
}