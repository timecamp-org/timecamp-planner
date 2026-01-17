import {
  CreateOAuthUserBindingResult,
  CreateUserFromTokenResult,
  GetUserFromTokenResult,
  OpenIdSubjectInterface
} from './types';
import { Id } from '../common/identifier';

export interface OpenIdServiceInterface {
  createUserFromToken(userId: Id, token: string, ipAddress: string): Promise<CreateUserFromTokenResult>;
  getUserFromToken(token: string): Promise<GetUserFromTokenResult>;
  createOAuthUserBinding(userId: Id, subject: OpenIdSubjectInterface): Promise<CreateOAuthUserBindingResult>;
  getBoundUserId(subject: OpenIdSubjectInterface): Promise<Id>;
  
  deleteOAuthBindings(userId: Id): Promise<void>;
}
