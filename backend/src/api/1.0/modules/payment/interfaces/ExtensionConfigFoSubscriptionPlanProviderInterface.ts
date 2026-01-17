import { ExtensionConfigForSubscriptionPlanDbRow } from "../../db/schema";
import { Id } from "../../common/identifier";

export interface ExtensionConfigFoSubscriptionPlanProviderInterface {
  getExtensionConfigForPlan(extensionId: Id, subscriptionPlanId: Id): Promise<ExtensionConfigForSubscriptionPlanDbRow>;
}
