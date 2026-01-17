import { UserProfile, GoogleAuthResponse, DrivePickerDocument } from "./types";
import { Maybe } from "../common/types";

export type CreateDrivePickerCallback = (documents: DrivePickerDocument[]) => never;
export interface GoogleApiClientInterface {
  init(): void;

  initOAuth2Api(): PromiseLike<any>;

  initDrivePickerApi(): PromiseLike<any>;

  isInitialized(): PromiseLike<boolean>;

  initIfNotInitialized(): void;

  signIn(): PromiseLike<UserProfile>;

  signOut(): void;

  isSignedIn(): PromiseLike<boolean>;

  getIdToken(): PromiseLike<Maybe<string>>;

  getAuthResponse(): PromiseLike<Maybe<GoogleAuthResponse>>;

  getUserProfile(): PromiseLike<Maybe<UserProfile>>;

  createDrivePicker(callback: CreateDrivePickerCallback): PromiseLike<void>;
}
