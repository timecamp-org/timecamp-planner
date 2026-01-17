import type { Id } from '../common/identifier';

export enum OAuth1AuthorizedApplication {
  TRELLO = 'trello',
}

export type OAuth1Config = {
  [applicationName: string]: {
    requestURL: string;
    accessURL: string;
    authorizeURL: string;
  };
};

export type OAuth1ClientDbRow = {
  id: Id;
  applicationName: OAuth1AuthorizedApplication;
};

export type OAuth1RequestTokenAndSecret = {
  requestToken: string;
  requestTokenSecret: string;
};

export type OAuth1AccessTokenAndSecret = {
  accessToken: string;
  accessTokenSecret: string;
};

export type ApiKeyAndSecret = {
  apiKey: string;
  secret: string;
};

export type OAuth1RequestTokenDbRow = {
  userId: Id;
  organizationId: Id;
  clientId: Id;
  token: string;
  secret: string;
};

export type OAuth1AccessTokenDbRow = {
  userId: Id;
  organizationId: Id;
  clientId: Id;
  token: string;
  secret: string;
};

export type OAuth1ApiKeyDbRow = {
  userId: Id;
  organizationId: Id;
  clientId: Id;
  apiKey: string;
  secret: string;
};

export type ApplicationNameByClientId = {
  [clientId: string]: string;
};
