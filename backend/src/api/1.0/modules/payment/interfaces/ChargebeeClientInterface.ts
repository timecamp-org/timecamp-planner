import { AnyDict } from "../../common/types";
import { Id } from "../../common/identifier";

export default interface ChargebeeClientInterface {

  checkoutNewHostedPage(requestPayload: AnyDict): PromiseLike<AnyDict>;

  checkoutExistingHostedPage(requestPayload: AnyDict): PromiseLike<AnyDict>;

  retrieveSubscription(agentSubscriptionId: Id): PromiseLike<AnyDict>;

  retrieveCoupons(couponIds: Id[]): PromiseLike<AnyDict[]>;

  removeScheduledCancellation(agentSubscriptionId: Id): PromiseLike<AnyDict>;

  cancelSubscription(agentSubscriptionId: Id, params?: AnyDict): PromiseLike<AnyDict>;

  updateSubscription(agentSubscriptionId: Id, params?: AnyDict): PromiseLike<AnyDict>;

  retrieveInvoice(agentInvoiceId: Id): PromiseLike<AnyDict>;
  
  retrieveInvoicePdf(agentInvoiceId: Id): Promise<string>;

  retrieveSubscriptionInvoices(agentSubscriptionId: Id): PromiseLike<AnyDict[]>;

  retrieveSubscriptionRenewalEstimate(agentSubscriptionId: Id): Promise<AnyDict>;

}
