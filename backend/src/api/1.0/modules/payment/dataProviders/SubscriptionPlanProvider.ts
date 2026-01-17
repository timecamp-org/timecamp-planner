import { SubscriptionPlanProviderInterface } from "../interfaces/SubscriptionPlanProviderInterface";
import { SubscriptionPlanDbRow } from "../../db/schema";
import { inject, injectable } from "inversify";
import Table from "../../db/Table";

import { Id } from "../../common/identifier";
import { DbModule } from "../../db/DbModule";
import { ConnectionInterface } from "../../db/ConnectionInterface";

@injectable()
export class SubscriptionPlanProvider implements SubscriptionPlanProviderInterface {
  
  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {
  }

  async getSubscriptionPlan(planCode: string, trx?: Transaction): Promise<SubscriptionPlanDbRow> {
    let query = this.connection.getQueryWithTransaction(trx)
    const plan = await query
      .select()
      .from(Table.PAYMENTS_SUBSCRIPTION_PLAN)
      .where({
        planCode,
      })
      .first()
    return {
      ...plan,
      costPerSeat: parseFloat(plan.costPerSeat),
    }
  }

  async getSubscriptionPlans(): Promise<SubscriptionPlanDbRow[]> {
    return await this.connection.getQueryBuilder()
      .select()
      .from(Table.PAYMENTS_SUBSCRIPTION_PLAN)
  }

  async getPlanById(id: Id, trx?: Transaction): Promise<SubscriptionPlanDbRow> {
    let query = this.connection.getQueryWithTransaction(trx)
    return await query
      .select()
      .from(Table.PAYMENTS_SUBSCRIPTION_PLAN)
      .where({
        id
      })
      .first()
  }
  
}
