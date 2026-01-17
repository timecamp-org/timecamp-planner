import { ExtensionConfigFoSubscriptionPlanProviderInterface } from "../interfaces/ExtensionConfigFoSubscriptionPlanProviderInterface";
import { injectable, inject } from "inversify";
import { Id } from "aws-sdk/clients/kinesisanalytics";
import { ExtensionConfigForSubscriptionPlanDbRow } from "../../db/schema";
import Table from "../../db/Table";
import { DbModule } from "../../db/DbModule";
import { ConnectionInterface } from "../../db/ConnectionInterface";

@injectable()
export class ExtensionConfigForSubscriptionPlanProvider
  implements ExtensionConfigFoSubscriptionPlanProviderInterface {

  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {}

  async getExtensionConfigForPlan(extensionId: Id, subscriptionPlanId: Id): Promise<ExtensionConfigForSubscriptionPlanDbRow> {
    return await this.connection.getQueryBuilder()
      .first()
      .from(Table.EXTENSION_CONFIG_FOR_SUBSCRIPTION_PLAN)
      .where({
        extensionId,
        subscriptionPlanId
      })
  }
}
