import { Id } from "../../../utils/identifier";

export type OAuth2ClientInterfacfe = {
  id: Id,
  name: string,
  clientSecret: string,
  thumbnailUrl: string,
  redirectUris: string,
  grants: string,
  accessTokenLifetime: number,
  refreshTokenLifetime: number,
}
