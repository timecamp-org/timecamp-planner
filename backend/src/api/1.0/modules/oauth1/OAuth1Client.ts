import { OAuth } from "oauth"
import { injectable } from "inversify";
import { OAuth1ClientInterface } from "./interfaces/OAuth1ClientInterface";
import { OAuth1RequestTokenAndSecret, OAuth1AccessTokenAndSecret } from "./types";

@injectable()
export class OAuth1Client implements OAuth1ClientInterface {

  async getOAuthRequestToken(
    requestURL: string,
    accessURL: string,
    apiKey: string,
    secret: string,
    urlToRedirectAfterAuthorization: string,
  ): Promise<OAuth1RequestTokenAndSecret> {
    const oauth = new OAuth(requestURL, accessURL, apiKey, secret, "1.0A", urlToRedirectAfterAuthorization, "HMAC-SHA1")
    return new Promise<OAuth1RequestTokenAndSecret>((resolve, reject) => {
      oauth.getOAuthRequestToken(function (error, requestToken, requestTokenSecret, results) {
        if (error) {
          return reject(error)
        }

        resolve({ requestToken, requestTokenSecret })
      })
    })
  }

  async getOAuth1AccessTokens(
    requestURL: string,
    accessURL: string,
    apiKey: string,
    secret: string,
    requestToken: string,
    requestTokenSecret: string,
    verifier: string,
  ): Promise<OAuth1AccessTokenAndSecret> {
    const oauth = new OAuth(requestURL, accessURL, apiKey, secret, "1.0A", null, "HMAC-SHA1")
    return new Promise<OAuth1AccessTokenAndSecret>((resolve, reject) => {
      oauth.getOAuthAccessToken(requestToken, requestTokenSecret, verifier, function (error, accessToken, accessTokenSecret, results) {
        if (error) {
          return reject(error)
        }

        resolve({ accessToken, accessTokenSecret })
      })
    })
  }

  async getOAuth1ProtectedResource(
    requestURL: string,
    accessURL: string,
    apiKey: string,
    secret: string,
    accessToken: string,
    accessTokenSecret: string,
    resourceUrl: string,
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const oauth = new OAuth(requestURL, accessURL, apiKey, secret, "1.0A", null, "HMAC-SHA1")
      oauth.getProtectedResource(resourceUrl, "GET", accessToken, accessTokenSecret, function (error, data: string, response) {
        if (error) {
          return reject(error)
        }

        resolve(JSON.parse(data))
      })
    })
  }

}
