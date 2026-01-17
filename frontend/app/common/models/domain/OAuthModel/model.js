import { Record } from 'immutable'

export const OAuth2Client = new Record({
  id: undefined,
  name: undefined,
  thumbnailUrl: undefined,
  accessTokenLifetime: undefined,
  clientSecret: undefined,
  grants: undefined,
  redirectUris: undefined,
  refreshTokenLifetime: undefined,
})
