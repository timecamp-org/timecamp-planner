import { OAuth1AuthorizedApplication, OAuth1ClientDbRow, ApplicationNameByClientId } from "../types";
import { Id } from "../../common/identifier";

export interface OAuth1ClientProviderInterface {

  getClientByApplicationName(applicationName: OAuth1AuthorizedApplication): Promise<OAuth1ClientDbRow>

  getApplicationNamesByIds(ids: Id[]): Promise<ApplicationNameByClientId>

}
