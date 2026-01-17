import { IntegrationServiceInterface } from "./IntegrationServiceInterface";
import { Id } from "../../common/identifier";

export interface IntegrationServiceFactoryInterface {

  create(extensionId: Id): Promise<IntegrationServiceInterface>

}
