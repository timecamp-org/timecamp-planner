import { PaymentServiceInterface } from './interfaces/PaymentServiceInterface'
import {
  AgentCode,
  PaymentData,
  StartPaymentResult,
  StartPaymentStatus,
  PaymentHookResult,
  SubscriptionJson,
  Invoice,
  PaymentEventData,
  PaymentHookStatus,
  UpgradeOrganizationSubscriptionResult,
  UpgradeOrganizationSubscriptionStatus,
  CancelOrganizationSubscriptionResult,
  CancelOrganizationSubscriptionStatus,
  Coupon,
} from './types'
import { injectable, inject } from "inversify";
import { PaymentAgentFactory } from "./PaymentAgentFactory";
import { PaymentModule } from "./PaymentModule";
import { OrganizationsModule } from "../organizations/OrganizationsModule";
import { OrganizationServiceInterface } from "../organizations/interfaces/OrganizationServiceInterface";
import { InfrastructureModule } from "../../../../infrastructure/InfrastructureModule";
import { LoggerInterface } from "../../../../infrastructure/logger";
import { PaymentProviderInterface } from "./interfaces/PaymentProviderInterface";
import { AgentProviderInterface } from "./interfaces/AgentProviderInterface";
import { Id, IdGeneratorInterface } from "../common/identifier";


import { SubscriptionPlanProviderInterface } from "./interfaces/SubscriptionPlanProviderInterface";
import { CommonModule } from "../common/CommonModule";
import { Request } from "express";
import { EventDelegate } from "../../../../utils/EventDelegate";
import { TimeServiceInterface } from '../common/time/TimeServiceInterface';
import { ValidationDefinitionName, ValidationStatus } from '../common/validator/types';
import { ValidatorInterface } from '../common/validator/interfaces/ValidatorInterface';
import { userIsActiveAndNotBotModifier } from '../organizations/queryDecorators';
import { UserInOrganizationServiceInterface } from '../organizations/interfaces/UserInOrganizationServiceInterface';
import { ConnectionInterface } from '../db/ConnectionInterface';
import { DbModule } from '../db/DbModule';

@injectable()
export class PaymentService implements PaymentServiceInterface {
  public paymentEvent: EventDelegate<PaymentEventData>;

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
    @inject(CommonModule.TimeServiceInterface)
    private timeService: TimeServiceInterface,
    @inject(PaymentModule.PaymentAgentFactory)
    private agentFactory: PaymentAgentFactory,
    @inject(OrganizationsModule.OrganizationServiceInterface)
    private organizationService: OrganizationServiceInterface,
    @inject(OrganizationsModule.UserInOrganizationServiceInterface)
    private userInOrganizationService: UserInOrganizationServiceInterface,
    @inject(PaymentModule.PaymentProviderInterface)
    private paymentProvider: PaymentProviderInterface,
    @inject(PaymentModule.AgentProviderInterface)
    private agentProvider: AgentProviderInterface,
    @inject(PaymentModule.SubscriptionPlanProviderInterface)
    private planProvider: SubscriptionPlanProviderInterface,
    @inject(CommonModule.IdGeneratorInterface)
    private idGenerator: IdGeneratorInterface<Id>,
    @inject(CommonModule.ValidatorInterface)
    private validator: ValidatorInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
  ) {
    this.paymentEvent = new EventDelegate<PaymentEventData>(logger);
  }

  private isBillingEnabled(): boolean {
    return false
  }

  async startPayment(agentCode: AgentCode, paymentData: PaymentData, userId: Id): Promise<StartPaymentResult> {
    if (!this.isBillingEnabled()) {
      return {
        status: StartPaymentStatus.PAYMENT_AGENT_FAILED,
        message: 'Billing is disabled',
      }
    }
    return this.connection.getConnection().transaction(async (trx) => {
      return this.doStartPayment(trx, agentCode, paymentData, userId)
    })
  }

  async doStartPayment(trx: Transaction, agentCode: AgentCode, paymentData: PaymentData, userId: Id): Promise<StartPaymentResult> {
    try {
      const agent = this.agentFactory.getPaymentAgent(agentCode);
      const validationResult = await this.validator.validateObject(ValidationDefinitionName.PAYMENT_DATA, paymentData);
      if (validationResult.status !== ValidationStatus.OK) {
        this.logger.error(`ValidationError: ${validationResult.message}`)
        return {
          status: StartPaymentStatus.MALFORMED_REQUEST_CONTENT,
          message: validationResult.message,
        }
      }

      const organizationResult = await this.organizationService.getOrganization(paymentData.organizationId, trx);
      if (!organizationResult.organization) {
        this.logger.error(`Organization not found`)
        return {
          status: StartPaymentStatus.ORGANIZATION_NOT_FOUND
        }
      }

      const isUserOrganizationAdminResult = await this.userInOrganizationService.checkIfUserIsOrganizationAdmin(userId, paymentData.organizationId, trx);
      if (!isUserOrganizationAdminResult.userIsOrganizationAdmin) {
        this.logger.error(`User is not workspace admin`)
        return {
          status: StartPaymentStatus.USER_IS_NOT_ORGANIZATION_ADMIN
        }
      }

      const organizationUserCount = await this.organizationService.getOrganizationUserCount(paymentData.organizationId, true, trx, userIsActiveAndNotBotModifier)
      if (paymentData.seatCount < organizationUserCount) {
        this.logger.error(`Too much users in workspace`)
        return {
          status: StartPaymentStatus.USER_LIMIT_EXCEEDED,
        }
      }

      const agentDbRow = await this.agentProvider.getAgent(agentCode, trx);

      if (!agentDbRow) {
        this.logger.error(`Agent not found`)
        return {
          status: StartPaymentStatus.AGENT_NOT_FOUND
        }
      }
      const planDbRow = await this.planProvider.getSubscriptionPlan(paymentData.planId, trx)

      if (!planDbRow) {
        this.logger.error(`Plan not found`)
        return {
          status: StartPaymentStatus.PLAN_NOT_FOUND
        }
      }

      const { payment, errorCode, message } = await agent.startPayment(paymentData, trx);
      if (!payment) {
        this.logger.error(`Error while fetching hosted page [${errorCode}]: ${message}`)
        return {
          status: StartPaymentStatus.PAYMENT_AGENT_FAILED,
          message: message,
          errorCode,
        }
      }

      const existingPayment = await this.paymentProvider.getPaymentByAgentId(agentDbRow.id, payment.agentPaymentId, trx);

      let result = null
      if (existingPayment) {
        result = await this.paymentProvider.updatePayment(existingPayment.id, {
          paymentUrl: payment.url,
          expiresAt: payment.expiresAt,
        }, trx)
      } else {
        result = await this.paymentProvider.createPayment({
          id: this.idGenerator.generateId(),
          agentPaymentId: payment.agentPaymentId,
          organizationId: organizationResult.organization.id,
          createdAt: this.timeService.getCurrentTime(),
          expiresAt: payment.expiresAt,
          paymentUrl: payment.url,
          seatCount: paymentData.seatCount,
          agentId: agentDbRow.id,
          planId: planDbRow.id,
          userId,
        }, trx)
      }

      if (!result) {
        return {
          status: StartPaymentStatus.SAVE_PAYMENT_FAILED
        }
      }

      return {
        payment: result,
        plan: planDbRow,
        status: StartPaymentStatus.OK
      }

    } catch (error) {
      this.logger.error(error)
      return {
        status: StartPaymentStatus.PAYMENT_AGENT_FAILED,
        message: error.message,
      }
    }
  }


  async handlePaymentEvent(request: Request): Promise<PaymentHookResult> {
    if (!this.isBillingEnabled()) {
      return {
        status: PaymentHookStatus.UNKNOWN_EVENT_TYPE,
      }
    }
    const { agentCode } = request.params
    const webhookAgent = this.agentFactory.getWebhookAgent(agentCode as AgentCode);
    const result = await webhookAgent.handlePaymentEvent(request);
    if (result.status === PaymentHookStatus.OK && result.event) {
      this.paymentEvent.triggerEvent(result.event);
    } else {
      this.logger.warn('Not triggering event for unknown event type')
    }
    return result
  }

  async cancelOrganizationSubscription(agentCode: AgentCode, organizationId: Id, userId: Id): Promise<CancelOrganizationSubscriptionResult> {
    if (!this.isBillingEnabled()) {
      return {
        status: CancelOrganizationSubscriptionStatus.SUBSCRIPTION_NOT_FOUND,
      }
    }
    const { userIsOrganizationAdmin } = await this.userInOrganizationService.checkIfUserIsOrganizationAdmin(userId, organizationId)
    if (!userIsOrganizationAdmin) {
      return {
        status: CancelOrganizationSubscriptionStatus.USER_IS_NOT_ORGANIZATION_OWNER
      }
    }

    const agent = this.agentFactory.getPaymentAgent(agentCode);

    return await agent.cancelSubscription(organizationId);
  }

  async upgradeOrganizationSubscription(agentCode: AgentCode, organizationId: Id, subscriptionData: SubscriptionJson): Promise<UpgradeOrganizationSubscriptionResult> {
    if (!this.isBillingEnabled()) {
      return {
        status: UpgradeOrganizationSubscriptionStatus.SUBSCRIPTION_NOT_FOUND,
      }
    }
    const agent = this.agentFactory.getPaymentAgent(agentCode);
    const newSeatCount = subscriptionData.seatCount

    const organizationUserCount = await this.organizationService.getOrganizationUserCount(organizationId, true, null, userIsActiveAndNotBotModifier)
    if (newSeatCount < organizationUserCount) {
      return {
        status: UpgradeOrganizationSubscriptionStatus.USER_LIMIT_EXCEEDED,
      }
    }
    return await agent.upgradeSubscription(organizationId, subscriptionData);
  }

  async getSubscriptionInvoices(agentCode: AgentCode, agentSubscriptionId: Id): Promise<Invoice[]> {
    if (!this.isBillingEnabled()) {
      return []
    }
    const agent = this.agentFactory.getPaymentAgent(agentCode);
    return await agent.getSubscriptionInvoices(agentSubscriptionId);
  }

  async getSubscriptionCoupons(agentCode: AgentCode, agentSubscriptionId: Id): Promise<Coupon[]> {
    if (!this.isBillingEnabled()) {
      return []
    }
    const agent = this.agentFactory.getPaymentAgent(agentCode);
    return await agent.getSubscriptionCoupons(agentSubscriptionId);
  }

}
