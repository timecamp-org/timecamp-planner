import { AppleAuthServiceInterface } from './AppleAuthServiceInterface'
import { injectable, inject } from 'inversify';
import * as AppleSignin from 'apple-signin-auth'
import config from '../../../../../config/config';
import { UsersModule } from '../../users/UsersModule';
import { UserServiceInterface } from '../../users/UserServiceInterface';
import {
  AppleAuthenticationResult, 
  AppleAuthenticationStatus,
  CreateUserFromAppleTokenResult,
  CreateUserFromAppleTokenStatus
} from '../types';

import { Id } from '../../common/identifier';
import { CreateUserResult, CreateUserResultStatus } from '../../users/types';
import { UserJson } from '../../../../../services/types';
import { UserRegistrationStatus } from '../../common/enum';

@injectable()
export class AppleAuthService implements AppleAuthServiceInterface {

  constructor(
    @inject(UsersModule.UserServiceInterface)
    private userService: UserServiceInterface,
  ) {

  }

  async authenticate(identityToken: string): Promise<AppleAuthenticationResult> {
    const clientId = config.apple.mobileAppId
    // verify token (will throw error if failure)
    const appleToken = await
    AppleSignin.verifyIdToken(identityToken, {
      audience: clientId,
      ignoreExpiration: true, // ignore token expiry (never expires)
    });

    if (!appleToken.email) {
      return {
        status: AppleAuthenticationStatus.INVALID_ID_TOKEN
      }
    }

    // TODO: Bindings

    const userFromEmail = await this.userService.getUserByEmail(appleToken.email);

    if (!userFromEmail) {
      return {
        status: AppleAuthenticationStatus.USER_NOT_FOUND
      }
    }

    return { status: AppleAuthenticationStatus.OK, user: userFromEmail }
  }

  async createUserFromToken(userId: Id, identityToken: string, firstName: string, lastName: string, ipAddress: string): Promise<CreateUserFromAppleTokenResult> {
    const clientId = config.apple.mobileAppId
    // verify token (will throw error if failure)
    const appleToken = await
    AppleSignin.verifyIdToken(identityToken, {
      audience: clientId,
      ignoreExpiration: true, // ignore token expiry (never expires)
    });

    if (!appleToken.email) {
      return {
        status: CreateUserFromAppleTokenStatus.INVALID_ID_TOKEN
      }
    }
    const user: UserJson = {
      email: appleToken.email,
      firstName,
      lastName,
      registrationStatus: UserRegistrationStatus.REGISTERED,
      ipAddress,
    }

    // TODO: Bindings

    const createUserResult: CreateUserResult = await this.userService.createUser(userId, user)
    if (createUserResult.status === CreateUserResultStatus.EMAIL_TAKEN) {
      return { status: CreateUserFromAppleTokenStatus.EMAIL_TAKEN }
    }

    return {
      status: CreateUserFromAppleTokenStatus.OK,
      user: createUserResult.user
    }
  }
}