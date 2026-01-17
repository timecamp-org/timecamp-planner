import { OAuthScope } from '../api/1.1/modules/oauth2/types';
import { OAuthResponse as OAuthResponseV11 } from '../api/1.1/modules/oauth2/OAuthResponse';
import { OAuthResponse as OAuthResponseV10 } from '../api/1.0/modules/oauth2/OAuthResponse';
import { OAuthError } from 'oauth2-server';

export const NEW_NOTIFICATION = 'new-notification';

export interface PostgresListenerOptions {
  channel: string;
}

export interface AuthenticationOptions {
  scope?: OAuthScope;
}

export const RawResponseClasses = [OAuthResponseV11, OAuthResponseV10, OAuthError];

export enum ProcessEventType {
  SIGINT = 'SIGINT',
}
