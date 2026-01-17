import { injectable, inject } from "inversify";
import { FeedServiceInterface } from "../feed/interfaces/FeedServiceInterface";
import { LoggerInterface } from "../../../../infrastructure/logger";
import { InfrastructureModule } from "../../../../infrastructure/InfrastructureModule";
import { PaymentEventData, PaymentEventType } from "./types";
import { PutEntityMessage, FeedMessageType, Broadcast } from "../feed/types";
import { EntityType } from "../common/enum";
import { PaymentServiceInterface } from "./interfaces/PaymentServiceInterface";
import { PaymentModule } from "./PaymentModule";
import { SubscriptionProviderInterface } from "./interfaces/SubscriptionProviderInterface";
import { OrganizationsModule } from "../organizations/OrganizationsModule";
import { PaymentAgentFactory } from "./PaymentAgentFactory";
import { PaymentWebhookInterface } from "./interfaces/PaymentWebhookInterface";
import { UserInOrganizationProviderInterface } from "../organizations/interfaces/UserInOrganizationProviderInterface";
import { AgentProviderInterface } from "./interfaces/AgentProviderInterface";
import { AbstractFeedServicePlugin } from "../feed/AbstractFeedServicePlugin";

@injectable()
export class PaymentFeedServicePlugin
  extends AbstractFeedServicePlugin {

  private feedService: FeedServiceInterface;

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
    @inject(PaymentModule.PaymentServiceInterface)
    private paymentService: PaymentServiceInterface,
    @inject(PaymentModule.SubscriptionProviderInterface)
    private subscriptionProvider: SubscriptionProviderInterface,
    @inject(PaymentModule.PaymentAgentFactory)
    private agentFactory: PaymentAgentFactory,
    @inject(PaymentModule.AgentProviderInterface)
    private agentProvider: AgentProviderInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    private userInOrganizationProvider: UserInOrganizationProviderInterface,
  ) {
    super()
  }

  public async attach(feedService: FeedServiceInterface) {
    if (this.feedService) {
      this.logger.warn(`PaymentFeedServicePlugin already attached to FeedService!`);
      return;
    }
    this.feedService = feedService;
    this.paymentService.paymentEvent.attach(this.onPaymentEvent.bind(this));
  }

  async onPaymentEvent(paymentEvent: PaymentEventData) {
    if (!this.feedService) {
      this.logger.warn(`Cannot send invoice broadcast -- plugin not attached to FeedService!`);
      return;
    }

    const webhookAgent = this.agentFactory.getWebhookAgent(paymentEvent.agentCode)
    const paymentEventType = webhookAgent.getPaymentEventType(paymentEvent.type);

    switch (paymentEventType) {
      case PaymentEventType.INVOICE:
        return await this.onInvoiceEvent(paymentEvent, webhookAgent);
      case PaymentEventType.SUBSCRIPTION:
        return await this.onSubscriptionEvent(paymentEvent, webhookAgent);
      default: {
        this.logger.info(`Leaving ${paymentEvent.type} event`);
        break;
      }
    }
  }

  async onInvoiceEvent(paymentEvent: PaymentEventData, webhookAgent: PaymentWebhookInterface) {
    try {
      const invoice = paymentEvent.content.invoice
      this.logger.info(`Handling invoice ${invoice.id}...`);
      const subscription = await this.subscriptionProvider.getSubscriptionByAgentSubscriptionId(invoice.subscriptionId)
      if (!subscription) {
        return
      }
      const userIds = await this.userInOrganizationProvider.getOrganizationUserIds(subscription.organizationId)
      const notificationAction = webhookAgent.getEventNotificationAction(paymentEvent.type)

      const message: PutEntityMessage = {
        type: FeedMessageType.ENTITY,
        entityId: invoice.id,
        entityType: EntityType.SubscriptionInvoice,
        operation: notificationAction,
        body: invoice,
      };

      const broadcast: Broadcast = {
        message,
        recipients: userIds,
      }

      this.feedService.broadcast(broadcast);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async onSubscriptionEvent(paymentEvent: PaymentEventData, webhookAgent: PaymentWebhookInterface) {
    try {
      const subscription = paymentEvent.content.subscription
      this.logger.info(`Handling subscription ${subscription.id}...`);
      const userIds = await this.userInOrganizationProvider.getOrganizationUserIds(subscription.organizationId)
      const notificationAction = webhookAgent.getEventNotificationAction(paymentEvent.type)
      const subscriptionInOrganization = await this.subscriptionProvider.getSubscriptionForOrganizationId(subscription.organizationId)

      const agent = await this.agentProvider.getAgentById(subscriptionInOrganization.agentId)
      const coupons = await this.paymentService.getSubscriptionCoupons(agent.code, subscription.id);

      const message: PutEntityMessage = {
        type: FeedMessageType.ENTITY,
        entityId: subscription.id,
        entityType: EntityType.SubscriptionCoupons,
        operation: notificationAction,
        body: coupons,
      };

      const broadcast: Broadcast = {
        message,
        recipients: userIds,
      }

      this.feedService.broadcast(broadcast);
    } catch (error) {
      this.logger.error(error);
    }
  }

}
