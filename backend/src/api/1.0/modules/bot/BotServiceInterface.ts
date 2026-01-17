import { Id } from "../common/identifier";
import { CreateBotResult } from "./types";

export interface BotServiceInterface {
  createBotForOrganization(organizationId: Id): Promise<CreateBotResult>
}
