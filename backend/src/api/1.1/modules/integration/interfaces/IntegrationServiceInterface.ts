import { Id } from "../../common/identifier";
import { IntegrationResult } from "../types";

export interface IntegrationServiceInterface {

  start(extensionId: Id, organizationId: Id, userId: Id): Promise<IntegrationResult>

}
