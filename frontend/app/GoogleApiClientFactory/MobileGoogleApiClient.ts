import {
  GoogleSignin,
  statusCodes,
} from "../HeySpaceMobile/node_modules/@react-native-community/google-signin";
import { AuthStatus } from "../common/models/domain/CurrentUserModel/types";
import { parseUserInfoToUserProfile } from "./utils";
import {
  GoogleApiClientInterface,
  CreateDrivePickerCallback,
} from "./GoogleApiClientInterface";
import {
  GoogleApiClientConfig,
  UserProfile,
  BasicMobileGoogleProfile,
  GoogleAuthResponse,
} from "./types";
import { AnyDict } from "../common/types";
import ErrorDefinitions, { Type } from "../common/ErrorDefinitions";

class MobileGoogleApiClient implements GoogleApiClientInterface {
  private config: GoogleApiClientConfig;
  private googleApi: AnyDict;

  constructor(config) {
    this.config = config;
    this.googleApi = GoogleSignin;
  }

  init = async () => {
    this.googleApi.configure({
      webClientId: this.config.googleClientId, // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
  };

  isInitialized = async () => {
    if (this.googleApi.configPromise) {
      return await this.googleApi.configPromise;
    } else {
      return false;
    }
  };

  initIfNotInitialized = async () => {
    const isInitialized = await this.isInitialized();
    if (isInitialized) {
      return null;
    } else {
      return await this.init();
    }
  };

  async signIn(): Promise<UserProfile> {
    try {
      await this.googleApi.hasPlayServices();
      const userInfo: BasicMobileGoogleProfile = await this.googleApi.signIn();
      return parseUserInfoToUserProfile(userInfo);
    } catch (error) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          throw Error(AuthStatus.SIGN_IN_CANCELLED);
        case statusCodes.IN_PROGRESS:
          throw Error(AuthStatus.IN_PROGRESS);
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          throw Error(AuthStatus.PLAY_SERVICES_NOT_AVAILABLE);
        default: {
          throw error;
        }
      }
    }
  }

  async signOut() {
    await this.googleApi.revokeAccess();
    await this.googleApi.signOut();
  }

  async isSignedIn() {
    return await this.googleApi.isSignedIn();
  }

  async getIdToken() {
    const isSignedIn = await this.isSignedIn();
    if (!isSignedIn) {
      return null;
    }

    const userInfo = await this.googleApi.signInSilently();
    return userInfo.idToken;
  }

  async getUserProfile() {
    const isSignedIn = await this.isSignedIn();
    if (!isSignedIn) {
      return null;
    }

    const userInfo = await this.googleApi.signInSilently();
    return parseUserInfoToUserProfile(userInfo);
  }

  initOAuth2Api(): Promise<any> {
    throw ErrorDefinitions[Type.NOT_IMPLEMENTED];
  }

  initDrivePickerApi(): Promise<any> {
    throw ErrorDefinitions[Type.NOT_IMPLEMENTED];
  }

  getAuthResponse(): Promise<GoogleAuthResponse> {
    throw ErrorDefinitions[Type.NOT_IMPLEMENTED];
  }

  createDrivePicker(callback: CreateDrivePickerCallback): Promise<void> {
    throw ErrorDefinitions[Type.NOT_IMPLEMENTED];
  }
}

export default MobileGoogleApiClient;
