import {
  AgentCode,
  OrganizationSubscriptionCancellationStatus,
  PaymentEventType,
  PaymentHookResult,
  PaymentHookStatus,
  PaymentOptions,
  SubscriptionStatus,
} from '../types'
import { LoggerInterface } from '../../../../../infrastructure/logger'
import { SubscriptionPlanProviderInterface } from '../interfaces/SubscriptionPlanProviderInterface'
import { SubscriptionProviderInterface } from '../interfaces/SubscriptionProviderInterface'
import {
  ChargebeeEvent,
  ChargebeeEventType,
  ChargebeeSubscriptionStatus,
  ChargebeeSubscription,
} from './types'
import { SubscriptionInOrganizationDbRow, SubscriptionPlanDbRow } from '../../db/schema'
import ChargebeeClientInterface from '../interfaces/ChargebeeClientInterface'
import { TimeServiceInterface } from '../../common/time/TimeServiceInterface'

import { Request } from 'express'
import { OrganizationServiceInterface } from '../../organizations/interfaces/OrganizationServiceInterface'
import { Id, IdGeneratorInterface } from '../../common/identifier'

import { PaymentWebhookInterface } from '../interfaces/PaymentWebhookInterface'
import { ManualSubscriptionCanellationServiceInterface } from '../interfaces/ManualSubscriptionCanellationServiceInterface'
import { ModelParserInterface } from '../interfaces/ModelParserInterface';
import { AgentProviderInterface } from '../interfaces/AgentProviderInterface';
import { NotificationAction } from '../../db/types';
import { ChargebeePaymentAgent } from './ChargebeePaymentAgent';
import { MailerServiceInterface } from '../../mailer/interfaces/MailerServiceInterface'
import { UserInOrganizationProvider } from '../../organizations/dataProviders/UserInOrganizationProvider'
import { UserProviderInterface } from '../../users/UserProviderInterface'
import { FeedbackType } from '../../analytics/types'
import { ConnectionInterface } from '../../db/ConnectionInterface'
import UserFeedbackProviderInterface from '../../analytics/interfaces/UserFeedbackProviderInterface'
import { JsonSerializerInterface } from '../../common/json/JsonSerializerInterface'

const subscriptionEventsToNotify = [
  ChargebeeEventType.EVENT_SUBSCRIPTION_CANCELLED,
  ChargebeeEventType.EVENT_SUBSCRIPTION_CREATED,
  ChargebeeEventType.EVENT_SUBSCRIPTION_CHANGED,
  ChargebeeEventType.EVENT_SUBSCRIPTION_ACTIVATED,
  ChargebeeEventType.EVENT_SUBSCRIPTION_RESUMED,
  ChargebeeEventType.EVENT_SUBSCRIPTION_REACTIVATED,
  ChargebeeEventType.EVENT_SUBSCRIPTION_REACTIVATED,
]

export class ChargebeeWebhookAgent implements PaymentWebhookInterface {

  constructor(
    protected logger: LoggerInterface,
    private subscriptionPlanProvider: SubscriptionPlanProviderInterface,
    private subscriptionProvider: SubscriptionProviderInterface,
    private paymentClient: ChargebeeClientInterface,
    private timeService: TimeServiceInterface,
    private options: PaymentOptions,
    private organizationService: OrganizationServiceInterface,
    private idGenerator: IdGeneratorInterface<Id>,
    private manualSubscriptionCanellationService: ManualSubscriptionCanellationServiceInterface,
    private modelParser: ModelParserInterface,
    private agentProvider: AgentProviderInterface,
    private mailerService: MailerServiceInterface,
    private userInOrganizationProvider: UserInOrganizationProvider,
    private userProvider: UserProviderInterface,
    private userFeedbackProvider: UserFeedbackProviderInterface,
    private connection: ConnectionInterface,
    private jsonSerializer: JsonSerializerInterface,
  ) {
  }

  async handlePaymentEvent(request: Request): Promise<PaymentHookResult> {
    const { agentCode } = request.params
    const { key } = request.query
    const eventData: ChargebeeEvent = request.body
    this.logger.info(`Got hook ${eventData.event_type}`)
    if (key !== this.options.providerOptions.hookKey) {
      return {
        status: PaymentHookStatus.INVALID_REQUEST_KEY
      }
    }

    if (!eventData.id || !eventData.event_type) {
      this.logger.error('Bad event format')
      return {
        status: PaymentHookStatus.MALFORMED_REQUEST_CONTENT
      }
    }

    switch (eventData.event_type) {
      case ChargebeeEventType.EVENT_SUBSCRIPTION_CREATED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_CHANGED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_CANCELLED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_STARTED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_ACTIVATED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_RENEWED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_REACTIVATED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_CANCELLATION_SCHEDULED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_SCHEDULED_CANCELLATION_REMOVED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_DELETED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_PAUSED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_PAUSE_SCHEDULED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_SCHEDULED_PAUSE_REMOVED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_RESUMED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_RESUMPTION_SCHEDULED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_SCHEDULED_RESUMPTION_REMOVED: {
        const result = await this.handleSubscriptionEvent(agentCode as AgentCode, eventData);
        await this.sendNotify(eventData, result)
        return result
      }
      case ChargebeeEventType.EVENT_INVOICE_GENERATED:
      case ChargebeeEventType.EVENT_INVOICE_UPDATED:
      case ChargebeeEventType.EVENT_INVOICE_DELETED:
      {
        return await this.handleInvoiceEvent(agentCode as AgentCode, eventData);
      }
      default: {
        this.logger.warn(`Unknown event type: ${eventData.event_type}`)
        return {
          status: PaymentHookStatus.UNKNOWN_EVENT_TYPE,
        }
      }
    }
  }

  async sendNotify(eventData: ChargebeeEvent, paymentHookResult: PaymentHookResult): Promise<void> {
    const { currentSubscription, newSubscription } = paymentHookResult

    if (!newSubscription || !subscriptionEventsToNotify.includes(eventData.event_type)) {
      return
    }
    const userId = await this.userInOrganizationProvider.getOrganizationOwner(newSubscription.organizationId)
    const user = await this.userProvider.getUserById(userId)
    const { organization } = await this.organizationService.getOrganization(newSubscription.organizationId)

    switch (eventData.event_type) {
      case ChargebeeEventType.EVENT_SUBSCRIPTION_CREATED: {
        return this.mailerService.sendOrganizationSubscriptionCreationMail({
          agentSubscriptionId: newSubscription.agentSubscriptionId,
          issuer: user,
          organizationId: newSubscription.organizationId,
          organizationName: organization.name,
          seatCount: newSubscription.seatCount,
          subscriptionId: newSubscription.id,
        })
      }
      case ChargebeeEventType.EVENT_SUBSCRIPTION_CANCELLED: {
        const reason = await this.userFeedbackProvider.getLatestUserFeedbackByType(user.id, FeedbackType.SUBSCRIPTION_CANCELATION)
        const feedbackReason = reason ? this.jsonSerializer.toJson(reason.feedback) : ''
        const chargebeeReason = eventData.content?.subscription?.cancel_reason || ''
        return this.mailerService.sendOrganizationSubscriptionCancellationMail({
          agentSubscriptionId: newSubscription.agentSubscriptionId,
          issuer: user,
          organizationId: newSubscription.organizationId,
          organizationName: organization.name,
          seatCount: newSubscription.seatCount,
          subscriptionId: newSubscription.id,
          reason: `Feedback reason: ${feedbackReason} || Chargebee reason: ${chargebeeReason}`,
        })
      }
      case ChargebeeEventType.EVENT_SUBSCRIPTION_CHANGED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_ACTIVATED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_RESUMED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_REACTIVATED: {
        if (currentSubscription.status !== SubscriptionStatus.STATUS_ACTIVE
          && newSubscription.status === SubscriptionStatus.STATUS_ACTIVE
        ) {
          return this.mailerService.sendOrganizationSubscriptionChangeMail({
            agentSubscriptionId: newSubscription.agentSubscriptionId,
            issuer: user,
            organizationId: newSubscription.organizationId,
            organizationName: organization.name,
            seatCount: newSubscription.seatCount,
            subscriptionId: newSubscription.id,
          })
        }

        if (currentSubscription.seatCount > newSubscription.seatCount) {
          return this.mailerService.sendOrganizationSubscriptionDowngradeMail({
            agentSubscriptionId: newSubscription.agentSubscriptionId,
            issuer: user,
            organizationId: newSubscription.organizationId,
            organizationName: organization.name,
            seatCount: newSubscription.seatCount,
            prevSeatCount: currentSubscription.seatCount,
            subscriptionId: newSubscription.id,
          })
        }

        if (currentSubscription.seatCount < newSubscription.seatCount) {
          return this.mailerService.sendOrganizationSubscriptionUpgradeMail({
            agentSubscriptionId: newSubscription.agentSubscriptionId,
            issuer: user,
            organizationId: newSubscription.organizationId,
            organizationName: organization.name,
            seatCount: newSubscription.seatCount,
            prevSeatCount: currentSubscription.seatCount,
            subscriptionId: newSubscription.id,
          })
        }
        return
      }

      default:
        break;
    }
  }

  async handleSubscriptionEvent(agentCode: AgentCode, eventData: ChargebeeEvent): Promise<PaymentHookResult> {
    return this.connection.getConnection().transaction(async (trx) => {
      return this.doHandleSubscriptionEvent(trx, agentCode, eventData)
    })
  }

  async doHandleSubscriptionEvent(trx: Transaction, agentCode: AgentCode, eventData: ChargebeeEvent): Promise<PaymentHookResult> {
    try {
      this.logger.debug(`Handling event ${eventData.event_type}`)
      const eventContent = eventData.content

      const agent = await this.agentProvider.getAgent(agentCode, trx);

      if (!agent) {
        return {
          status: PaymentHookStatus.AGENT_NOT_FOUND,
        }
      }


      const subscriptionId = eventContent.subscription.id
      if (!subscriptionId) {
        return {
          status: PaymentHookStatus.AGENT_OBJECT_NOT_FOUND,
        }
      }

      const chargebeeSubscription = await this.paymentClient.retrieveSubscription(subscriptionId)

      if (!(chargebeeSubscription && chargebeeSubscription.cf_organization_id)) {
        return {
          status: PaymentHookStatus.AGENT_OBJECT_NOT_FOUND,
        }
      }

      const organizationId = chargebeeSubscription.cf_organization_id
      const organizationResult = await this.organizationService.getOrganization(organizationId, trx)
      const organization = organizationResult.organization

      if (!organization) {
        return {
          status: PaymentHookStatus.ORGANIZATION_NOT_FOUND,
        }
      }

      let nextPlan: SubscriptionPlanDbRow = null
      let startTime = null
      let endTime = null

      const defaultFreePlan = await this.subscriptionPlanProvider.getPlanById(this.options.defaultFreePlanId, trx);
      if (chargebeeSubscription.remaining_billing_cycles === 0) {
        nextPlan = defaultFreePlan
      }

      switch (chargebeeSubscription.status) {
        case ChargebeeSubscriptionStatus.STATUS_IN_TRIAL: {
          startTime = this.timeService.getTimeFromSeconds(chargebeeSubscription.trial_start)
          endTime = this.timeService.getTimeFromSeconds(chargebeeSubscription.trial_end)
          break;
        }
        case ChargebeeSubscriptionStatus.STATUS_NON_RENEWING: {
          nextPlan = defaultFreePlan;
        }
        case ChargebeeSubscriptionStatus.STATUS_ACTIVE: {
          startTime = this.timeService.getTimeFromSeconds(chargebeeSubscription.current_term_start)
          endTime = this.timeService.getTimeFromSeconds(chargebeeSubscription.current_term_end)
          break;
        }
        case ChargebeeSubscriptionStatus.STATUS_CANCELLED:
          startTime = null
          endTime = null
          await this.manualSubscriptionCanellationService.doSetOrganizationSubscriptionCancellationStatus(trx, organizationId, OrganizationSubscriptionCancellationStatus.COMPLETED)
        case ChargebeeSubscriptionStatus.STATUS_FUTURE:
        default: {
          startTime = null
          endTime = null
        }
      }

      const plan = await this.subscriptionPlanProvider.getSubscriptionPlan(chargebeeSubscription.plan_id, trx)

      const currentSubscription: SubscriptionInOrganizationDbRow = await this.subscriptionProvider.getSubscriptionForOrganizationId(organizationId, trx);
      let newSubscription: SubscriptionInOrganizationDbRow

      const nextBillingAmount = chargebeeSubscription.status !== ChargebeeSubscriptionStatus.STATUS_CANCELLED
        ? await this.getNextBillingAmount(plan, chargebeeSubscription, subscriptionId)
        : 0

      if (currentSubscription) {
        this.logger.debug(`Updating existing subscription ${currentSubscription.id}`)
        newSubscription = await this.subscriptionProvider.updateSubscription(currentSubscription.id, {
          organizationId,
          updatedAt: this.timeService.getCurrentTime(),
          expiresAt: endTime,
          createdAt: currentSubscription.createdAt,
          agentSubscriptionId: subscriptionId,
          agentId: agent.id,
          seatCount: chargebeeSubscription.plan_quantity,
          status: ChargebeePaymentAgent.getSubscriptionStatus(chargebeeSubscription.status),
          nextPlanId: nextPlan ? nextPlan.id : null,
          planId: plan.id,
          billingPeriod: plan.billingPeriod,
          nextBillingAmount,
        }, trx)
      } else {
        this.logger.debug('Creating new subscription...')
        newSubscription = await this.subscriptionProvider.createSubscription({
          id: this.idGenerator.generateId(),
          agentSubscriptionId: subscriptionId,
          agentId: agent.id,
          seatCount: chargebeeSubscription.plan_quantity,
          createdAt: startTime,
          expiresAt: endTime,
          nextPlanId: nextPlan ? nextPlan.id : null,
          organizationId,
          planId: plan.id,
          status: ChargebeePaymentAgent.getSubscriptionStatus(chargebeeSubscription.status),
          billingPeriod: plan.billingPeriod,
          nextBillingAmount,
        }, trx)
      }

      const event = await this.modelParser.parseEventData(agentCode, eventData, trx)

      return {
        status: PaymentHookStatus.OK,
        event,
        currentSubscription,
        newSubscription,
      }
    } catch (error) {
      this.logger.error(error)
      return {
        status: PaymentHookStatus.PAYMENT_CLIENT_ERROR,
      }
    }
  }

  async getNextBillingAmount(
    plan: SubscriptionPlanDbRow,
    chargebeeSubscription: ChargebeeSubscription,
    agentSubscriptionId: Id,
  ): Promise<number> {
    let nextBillingAmount = plan.costPerSeat * chargebeeSubscription.plan_quantity
    if (isNaN(nextBillingAmount)) {
      nextBillingAmount = 0
    }

    try {
      const estimate = await this.paymentClient.retrieveSubscriptionRenewalEstimate(agentSubscriptionId)

      if (estimate && estimate.invoice_estimate) {
        nextBillingAmount = estimate.invoice_estimate.total
      }
      return nextBillingAmount
    } catch (error) {
      this.logger.error(error.message)
      return 0
    }
  }

  async handleInvoiceEvent(agentCode: AgentCode, eventData: ChargebeeEvent): Promise<PaymentHookResult> {
    return this.connection.getConnection().transaction(async (trx) => {
      return this.doHandleInvoiceEvent(trx, agentCode, eventData)
    })
  }

  async doHandleInvoiceEvent(trx: Transaction, agentCode: AgentCode, eventData: ChargebeeEvent): Promise<PaymentHookResult> {
    try {
      this.logger.debug(`Handling event ${eventData.event_type}`)

      const eventContent = eventData.content
      const invoiceId = eventContent.invoice.id
      if (!invoiceId) {
        return {
          status: PaymentHookStatus.AGENT_OBJECT_NOT_FOUND,
        }
      }

      const chargebeeInvoice = await this.paymentClient.retrieveInvoice(invoiceId);

      if (!chargebeeInvoice) {
        return {
          status: PaymentHookStatus.AGENT_OBJECT_NOT_FOUND,
        }
      }

      let chargebeeSubscription: ChargebeeSubscription

      if (chargebeeInvoice.subscription_id) {
        chargebeeSubscription = await this.paymentClient.retrieveSubscription(chargebeeInvoice.subscription_id);
      }

      if (!(chargebeeSubscription && chargebeeSubscription.cf_organization_id)) {
        return {
          status: PaymentHookStatus.AGENT_OBJECT_NOT_FOUND,
        }
      }

      const organizationId = chargebeeSubscription.cf_organization_id
      const organizationResult = await this.organizationService.getOrganization(organizationId, trx)
      const organization = organizationResult.organization

      if (!organization) {
        return {
          status: PaymentHookStatus.ORGANIZATION_NOT_FOUND,
        }
      }

      const subscription = await this.subscriptionProvider.getSubscriptionForOrganizationId(organizationId, trx);

      if (!subscription) {
        return {
          status: PaymentHookStatus.SUBSCRIPTION_NOT_FOUND,
        }
      }

      const event = await this.modelParser.parseEventData(agentCode, eventData, trx)

      return {
        status: PaymentHookStatus.OK,
        event,
      }
    } catch (error) {
      this.logger.error(error)
      return {
        status: PaymentHookStatus.PAYMENT_CLIENT_ERROR,
      }
    }
  }

  getEventNotificationAction(eventType: string): NotificationAction {
    switch (eventType) {
      case ChargebeeEventType.EVENT_INVOICE_GENERATED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_CREATED:
        return NotificationAction.INSERT
      case ChargebeeEventType.EVENT_INVOICE_DELETED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_DELETED:
        return NotificationAction.DELETE
      case ChargebeeEventType.EVENT_INVOICE_UPDATED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_CHANGED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_CANCELLED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_STARTED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_ACTIVATED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_RENEWED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_REACTIVATED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_CANCELLATION_SCHEDULED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_SCHEDULED_CANCELLATION_REMOVED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_PAUSED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_PAUSE_SCHEDULED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_SCHEDULED_PAUSE_REMOVED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_RESUMED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_RESUMPTION_SCHEDULED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_SCHEDULED_RESUMPTION_REMOVED:
        return NotificationAction.UPDATE
      default: throw new Error(`Unsupported eventType: ${eventType}`)
    }
  }

  getPaymentEventType(eventType: string): PaymentEventType {
    switch (eventType) {
      case ChargebeeEventType.EVENT_INVOICE_DELETED:
      case ChargebeeEventType.EVENT_INVOICE_GENERATED:
      case ChargebeeEventType.EVENT_INVOICE_UPDATED:
        return PaymentEventType.INVOICE
      case ChargebeeEventType.EVENT_SUBSCRIPTION_CREATED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_CHANGED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_CANCELLED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_STARTED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_ACTIVATED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_RENEWED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_REACTIVATED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_CANCELLATION_SCHEDULED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_SCHEDULED_CANCELLATION_REMOVED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_DELETED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_PAUSED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_PAUSE_SCHEDULED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_SCHEDULED_PAUSE_REMOVED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_RESUMED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_RESUMPTION_SCHEDULED:
      case ChargebeeEventType.EVENT_SUBSCRIPTION_SCHEDULED_RESUMPTION_REMOVED:
        return PaymentEventType.SUBSCRIPTION
      default: throw new Error(`Unsupported eventType: ${eventType}`)
    }
  }

}
