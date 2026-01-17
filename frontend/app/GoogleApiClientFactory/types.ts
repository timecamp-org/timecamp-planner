export interface UserProfile {
  email: string,
  firstName: string,
  lastName: string,
  displayName: string,
  avatar: string,
  idToken?: string,
}

export interface GoogleAuthResponse {
  access_token: string,
  id_token: string,
}

export interface GoogleApiClientConfig {
  googleClientId: string,
  googleDeveloperKey?: string,
  scope?: string,
  timeout?: number,
}

export interface BasicGoogleProfile {
  getId(): string,
  getName(): string,
  getGivenName(): string,
  getFamilyName(): string,
  getEmail(): string,
  getImageUrl(): string,
}

export interface BasicMobileGoogleProfile {
  idToken: string,
  accessToken: string | null,
  accessTokenExpirationDate: number | null, // DEPRECATED, on iOS it's a time interval since now in seconds, on Android it's always null
  serverAuthCode: string,
  scopes: Array<string>, // on iOS this is empty array if no additional scopes are defined
  user: AuthUser,
}

export interface AuthUser {
  email: string,
  id: string,
  givenName: string,
  familyName: string,
  photo: string, // url
  name: string // full name
}

export interface DrivePickerDocument {
  name: string,
  url: string,
}
