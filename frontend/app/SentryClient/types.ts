export interface SentryUserData {
  userId: string,
  username: string,
  email: string,
}

export interface SentryClientOptions {
  release?: string,
  sentryDSN: string,
  blacklistUrls?: string[],
  ignoreErrors?: string[]

}

export type SentryFilter = (error: Error) => boolean;
