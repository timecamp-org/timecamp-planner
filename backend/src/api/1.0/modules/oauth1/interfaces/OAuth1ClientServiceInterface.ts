import { Id } from "../../common/identifier";
import { OAuth1AuthorizedApplication } from "../types";

export interface OAuth1ClientServiceInterface {

  getAuthorizeUrl(
    organizationId: Id,
    userId: Id,
    applicationName: OAuth1AuthorizedApplication,
    apiKey: string,
    secret: string,
    pathToRedirectAfterAuthorization: string,
  ): PromiseLike<string>

  authorize(
    organizationId: Id,
    userId: Id,
    applicationName: OAuth1AuthorizedApplication,
    requestToken: string,
    verifier: string,
  ): PromiseLike<void>

  deauthorize(
    organizationId: Id,
    userId: Id,
    applicationName: OAuth1AuthorizedApplication,
  ): PromiseLike<void>

  getOAuth1ProtectedResource(
    applicationName: OAuth1AuthorizedApplication,
    organizationId: Id,
    userId: Id,
    resourceUrl: string,
  ): PromiseLike<any>

  getAuthorizedApplications(
    organizationId: Id,
    userId: Id,
  ): PromiseLike<string[]>

}
