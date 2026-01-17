import { parseBasicProfileToUserProfile } from './utils'
import { GoogleApiClientInterface, CreateDrivePickerCallback } from './GoogleApiClientInterface';
import { GoogleApiClientConfig, UserProfile, BasicGoogleProfile, GoogleAuthResponse, DrivePickerDocument } from './types';
import { AnyDict, Maybe } from '../common/types';
import { LoggerInterface } from '../common/interfaces/LoggerInterface';
import { i18n } from 'i18n';

const defaultConfig = {
  scope: 'profile email https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.photos.readonly',
  timeout: 10 * 1000, // 10 seconds
}

class BrowserGoogleApiClient implements GoogleApiClientInterface {

  private config: GoogleApiClientConfig
  private googleApi: AnyDict;
  private google: AnyDict;
  private logger: LoggerInterface;

  constructor(
    config,
    logger = console,
  ) {
    this.config = { ...defaultConfig, ...config }
    this.googleApi = typeof window.gapi === 'object' ? window.gapi : undefined
    this.logger = logger
  }

  init = async () => {
    if (this.googleApi) {
      await this.initOAuth2Api()
      await this.initDrivePickerApi()
    }
    this.google = typeof window.google === 'object' ? window.google : undefined
  }

  initOAuth2Api = async () => new Promise((resolve, reject) => {
    this.googleApi.load('client:auth2', {
      callback: () => {
        this.googleApi.client.init({
          clientId: this.config.googleClientId,
          scope: this.config.scope,
          prompt: 'select_account',
        }).then(
          resolve, // successful init
          reject,
        )
      },
      timeout: this.config.timeout,
      ontimeout: function () {
        return reject(new Error('GoogleApiClient oauth2 load timeout'))
      },
      onerror: function (error) {
        return reject(error)
      }
    })
  })

  initDrivePickerApi = async () => new Promise((resolve, reject) => {
    this.googleApi.load('client:picker', {
      callback: resolve,
      timeout: this.config.timeout,
      ontimeout: function () {
        return reject(new Error('GoogleApiClient picker load timeout'))
      },
      onerror: reject,
    })
  })

  isInitialized = async (): Promise<boolean> => {
    return !!this.googleApi.client
  }

  initIfNotInitialized = async () => {
    if (this.isInitialized()) {
      return null
    } else {
      return await this.init()
    }
  }

  /**
   * @returns {UserProfile}
   */
  async signIn(): Promise<UserProfile> {
    await this.googleApi.auth2.getAuthInstance().signIn()
    return await this.getUserProfile()
  }

  async signOut(): Promise<void> {
    this.googleApi.auth2.getAuthInstance()
      .signOut()
      .catch((error) => this.logger.error(error))
      .then(() => this.logger.info('Gapi signed out'))
  }

  async isSignedIn(): Promise<boolean> {
    return this.googleApi.auth2.getAuthInstance().isSignedIn.get() as boolean
  }

  async getIdToken(): Promise<Maybe<string>> {
    const authResponse = await this.getAuthResponse()
    if (!authResponse) {
      return null
    }
    return authResponse.id_token
  }

  async getAuthResponse(): Promise<Maybe<GoogleAuthResponse>> {
    if (!this.isSignedIn()) {
      return null
    }

    return this.googleApi.auth2.getAuthInstance().currentUser.get().getAuthResponse()
  }

  async getUserProfile(): Promise<Maybe<UserProfile>> {
    if (!this.isSignedIn()) {
      return null
    }

    const basicProfile: BasicGoogleProfile = await this.googleApi.auth2.getAuthInstance().currentUser.get().getBasicProfile()
    const idToken = await this.getIdToken()
    return {
      ...parseBasicProfileToUserProfile(basicProfile),
      idToken,
    }
  }

  createDrivePicker = async (callback: CreateDrivePickerCallback): Promise<void> => {
    let authResponse = await this.getAuthResponse()
    if (!authResponse.access_token) {
      await this.signIn()
      authResponse = await this.getAuthResponse()
    }

    if (!authResponse.access_token) {
      return null
    }

    const folderView = new this.google.picker.DocsView()
      .setIncludeFolders(true)
      .setParent('root');

    const sharedDriveView = new this.google.picker.DocsView()
      .setIncludeFolders(true)
      .setSelectFolderEnabled(false)
      .setEnableDrives(true)

    const picker = new this.google.picker.PickerBuilder()
      .enableFeature(this.google.picker.Feature.MULTISELECT_ENABLED)
      .enableFeature(this.google.picker.Feature.SUPPORT_DRIVES)
      .setOAuthToken(authResponse.access_token)
      .setLocale(i18n.language)
      .addView(folderView)
      .addView(sharedDriveView)
      .setCallback((data) => {
        let documents: DrivePickerDocument[] = []
        if (data[this.google.picker.Response.ACTION] === this.google.picker.Action.PICKED) {
          documents = data[this.google.picker.Response.DOCUMENTS]
        }
        callback(documents)
      })
      .build();
    picker.setVisible(true)
  }

}

export default BrowserGoogleApiClient
