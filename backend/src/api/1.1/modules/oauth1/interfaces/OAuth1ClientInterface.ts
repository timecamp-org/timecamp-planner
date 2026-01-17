import { OAuth1RequestTokenAndSecret, OAuth1AccessTokenAndSecret } from "../types";

export interface OAuth1ClientInterface {

  getOAuthRequestToken(
    requestURL: string,
    accessURL: string,
    apiKey: string,
    secret: string,
    urlToRedirectAfterAuthorization: string,
  ): Promise<OAuth1RequestTokenAndSecret>

  getOAuth1AccessTokens(
    requestURL: string,
    accessURL: string,
    apiKey: string,
    secret: string,
    requestToken: string,
    requestTokenSecret: string,
    verifier: string,
  ): Promise<OAuth1AccessTokenAndSecret>

  getOAuth1ProtectedResource(
    requestURL: string,
    accessURL: string,
    apiKey: string,
    secret: string,
    accessToken: string,
    accessTokenSecret: string,
    resourceUrl: string,
    ): Promise<any>

}
