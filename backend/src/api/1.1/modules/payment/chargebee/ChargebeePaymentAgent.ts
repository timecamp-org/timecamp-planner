import { LoggerInterface } from '../../../../../infrastructure/logger';
import { TimeServiceInterface } from '../../common/time/TimeServiceInterface';
import ChargebeeClientInterface from '../interfaces/ChargebeeClientInterface';
import { PaymentAgentInterface } from '../interfaces/PaymentAgentInterface';
import { SubscriptionPlanProviderInterface } from '../interfaces/SubscriptionPlanProviderInterface';
import { SubscriptionProviderInterface } from '../interfaces/SubscriptionProviderInterface';
import {
  CancelOrganizationSubscriptionResult,
  CancelOrganizationSubscriptionStatus,
  Coupon,
  Invoice,
  Payment,
  PaymentData,
  StartAgentPaymentResult,
  SubscriptionJson,
  SubscriptionStatus,
  UpgradeOrganizationSubscriptionResult,
  UpgradeOrganizationSubscriptionStatus,
} from '../types';
import {
  ChargebeeAppliedCoupon,
  ChargebeeCoupon,
  ChargebeeHostedPage,
  ChargebeeInvoice,
  ChargebeeRequestPayload,
} from './types';

import { HttpStatus } from '../../../../../infrastructure/enum';
import { Id } from '../../common/identifier';
import { ConnectionInterface } from '../../db/ConnectionInterface';
import { SubscriptionInOrganizationDbRow } from '../../db/schema';
import { OrganizationServiceInterface } from '../../organizations/interfaces/OrganizationServiceInterface';
import { ModelParserInterface } from '../interfaces/ModelParserInterface';

export class ChargebeePaymentAgent implements PaymentAgentInterface {
  protected logger: LoggerInterface;
  private subscriptionPlanProvider: SubscriptionPlanProviderInterface;
  private subscriptionProvider: SubscriptionProviderInterface;
  private paymentClient: ChargebeeClientInterface;
  private timeService: TimeServiceInterface;
  private organizationService: OrganizationServiceInterface;
  private modelParser: ModelParserInterface;

  constructor(
    logger: LoggerInterface,
    subscriptionPlanProvider: SubscriptionPlanProviderInterface,
    subscriptionProvider: SubscriptionProviderInterface,
    paymentClient: ChargebeeClientInterface,
    timeService: TimeServiceInterface,
    organizationService: OrganizationServiceInterface,
    modelParser: ModelParserInterface,
    private connection: ConnectionInterface
  ) {
    this.logger = logger;
    this.subscriptionPlanProvider = subscriptionPlanProvider;
    this.subscriptionProvider = subscriptionProvider;
    this.paymentClient = paymentClient;
    this.timeService = timeService;
    this.organizationService = organizationService;
    this.modelParser = modelParser;
    this.connection = connection;
  }

  async getSubscriptionAgentData(organizationId: Id, trx?: Transaction) {
    try {
      const currentSubscription = await this.subscriptionProvider.getSubscriptionForOrganizationId(organizationId, trx);

      return this.paymentClient.retrieveSubscription(currentSubscription.agentSubscriptionId);
    } catch (e) {
      throw new Error(e);
    }
  }

  async startPayment(paymentData: PaymentData, trx?: Transaction): Promise<StartAgentPaymentResult> {
    this.logger.info(`Starting payment for plan ${paymentData.planId} ...`);
    const plan = await this.subscriptionPlanProvider.getSubscriptionPlan(paymentData.planId, trx);
    const currentSubscription = await this.subscriptionProvider.getSubscriptionForOrganizationId(
      paymentData.organizationId,
      trx
    );

    if (currentSubscription && plan.costPerSeat === 0) {
      const cancelResult = await this.cancelSubscription(currentSubscription.organizationId);
      if (cancelResult.status !== CancelOrganizationSubscriptionStatus.OK) {
        throw new Error(
          `Current subscription cancellation failed. Subscription: ${currentSubscription.id} (chargebee id: ${currentSubscription.agentSubscriptionId})`
        );
      }
    }

    if (currentSubscription && currentSubscription.agentSubscriptionId) {
      try {
        const subscription = await this.paymentClient.retrieveSubscription(currentSubscription.agentSubscriptionId);
        if (subscription.cancelled_at > 0) {
          await this.paymentClient.removeScheduledCancellation(currentSubscription.agentSubscriptionId);
        }
      } catch (error) {
        if (error.http_status_code === HttpStatus.NOT_FOUND) {
          this.logger.info('Chargebee subscription not found`. Creating new one.');
          currentSubscription.agentSubscriptionId = null;
        } else {
          this.logger.error(new Error(error.message));
        }
      }
    }

    let hostedPage: ChargebeeHostedPage;
    try {
      hostedPage = await this.requestHostedPage(currentSubscription, paymentData);
    } catch (error) {
      return {
        errorCode: error.http_status_code,
        message: error.error_msg,
      };
    }

    this.logger.info('Got hosted page', hostedPage);

    const payment: Payment = {
      agentPaymentId: hostedPage.id,
      expiresAt: this.timeService.getTimeFromSeconds(hostedPage.expires_at),
      url: hostedPage.url,
    };

    return {
      payment,
    };
  }

  prepareHostedPageRequest(paymentData: PaymentData): ChargebeeRequestPayload {
    let requestData: ChargebeeRequestPayload = {
      subscription: {
        plan_id: paymentData.planId,
        plan_quantity: paymentData.seatCount,
        cf_organization_id: paymentData.organizationId,
      },
      custom_field: 'test',
      embed: true,
      iframe_messaging: true,
    };

    const billingAddress = paymentData.billingAddress;

    if (billingAddress) {
      requestData = {
        ...requestData,
        customer: {
          email: billingAddress.email,
          first_name: billingAddress.firstName,
          last_name: billingAddress.lastName,
          company: billingAddress.company,
        },
        billing_address: {
          email: billingAddress.email,
          first_name: billingAddress.firstName,
          last_name: billingAddress.lastName,
          line1: billingAddress.line1,
          city: billingAddress.city,
          state: billingAddress.state,
          zip: billingAddress.zip,
          country: billingAddress.country,
          company: billingAddress.company,
        },
      };
    }

    return requestData;
  }

  private async requestHostedPage(
    currentSubscription: SubscriptionInOrganizationDbRow,
    paymentData: PaymentData
  ): Promise<ChargebeeHostedPage> {
    const requestPayload = this.prepareHostedPageRequest(paymentData);
    this.logger.info('Requesting hosted page from chargebee...');

    if (currentSubscription) {
      if (
        currentSubscription.status === SubscriptionStatus.STATUS_CANCELLED ||
        !currentSubscription.agentSubscriptionId
      ) {
        this.logger.info(
          'Current subscription was cancelled or is lifetime without agent. Creating new subscription without trial...'
        );
        requestPayload['subscription']['trial_end'] = 0;
        return await this.paymentClient.checkoutNewHostedPage(requestPayload);
      } else if (currentSubscription.agentSubscriptionId) {
        requestPayload['subscription']['id'] = currentSubscription.agentSubscriptionId;
        return await this.paymentClient.checkoutExistingHostedPage(requestPayload);
      }
    } else {
      return await this.paymentClient.checkoutNewHostedPage(requestPayload);
    }
  }

  async cancelSubscription(organizationId: Id): Promise<CancelOrganizationSubscriptionResult> {
    const currentSubscription = await this.subscriptionProvider.getSubscriptionForOrganizationId(organizationId);

    if (!currentSubscription) {
      return {
        status: CancelOrganizationSubscriptionStatus.SUBSCRIPTION_NOT_FOUND,
      };
    }

    if (!currentSubscription.agentSubscriptionId) {
      await this.subscriptionProvider.updateSubscription(currentSubscription.id, {
        organizationId: currentSubscription.organizationId,
        status: SubscriptionStatus.STATUS_CANCELLED,
      });
      return {
        status: CancelOrganizationSubscriptionStatus.OK,
        subscription: currentSubscription,
      };
    }

    try {
      await this.paymentClient.cancelSubscription(currentSubscription.agentSubscriptionId, {
        credit_option_for_current_term_charges: 'prorate',
      });
      return {
        status: CancelOrganizationSubscriptionStatus.OK,
        subscription: currentSubscription,
      };
    } catch (error) {
      this.logger.error(
        `Subscription cancellation failed: ${currentSubscription.id} (chargebee id: ${currentSubscription.agentSubscriptionId})`,
        error.message
      );
    }
  }

  async upgradeSubscription(
    organizationId: string,
    subscriptionData: SubscriptionJson
  ): Promise<UpgradeOrganizationSubscriptionResult> {
    return this.connection.getConnection().transaction(async (trx) => {
      return this.doUpgradeSubscription(trx, organizationId, subscriptionData);
    });
  }

  async doUpgradeSubscription(
    trx: Transaction,
    organizationId: string,
    subscriptionData: SubscriptionJson
  ): Promise<UpgradeOrganizationSubscriptionResult> {
    const currentSubscription = await this.subscriptionProvider.getSubscriptionForOrganizationId(organizationId, trx);

    if (!currentSubscription) {
      return {
        status: UpgradeOrganizationSubscriptionStatus.SUBSCRIPTION_NOT_FOUND,
      };
    }
    this.logger.info(`Upgrading subscription ${currentSubscription.id}...`);

    const organizationResult = await this.organizationService.getOrganization(organizationId, trx);

    if (!organizationResult.organization) {
      return {
        status: UpgradeOrganizationSubscriptionStatus.ORGANIZATION_NOT_FOUND,
      };
    }

    try {
      await this.paymentClient.updateSubscription(currentSubscription.agentSubscriptionId, {
        plan_quantity: subscriptionData.seatCount,
        // TODO: more props later
      });
    } catch (error) {
      throw new Error(error.message);
    }

    await this.subscriptionProvider.updateSubscription(
      currentSubscription.id,
      {
        organizationId,
        updatedAt: this.timeService.getCurrentTime(),
        seatCount: subscriptionData.seatCount,
      },
      trx
    );

    return {
      status: UpgradeOrganizationSubscriptionStatus.OK,
    };
  }

  async getSubscriptionInvoices(agentSubscriptionId: Id): Promise<Invoice[]> {
    let chargebeeInvoices: ChargebeeInvoice[] = [];
    try {
      chargebeeInvoices = await this.paymentClient.retrieveSubscriptionInvoices(agentSubscriptionId);
    } catch (error) {
      throw new Error(error.message);
    }
    const subscription = await this.subscriptionProvider.getSubscriptionByAgentSubscriptionId(agentSubscriptionId);
    const invoicePromises = chargebeeInvoices.map(
      async (cbInvoice) => await this.modelParser.parseInvoiceEventData(cbInvoice, subscription)
    );

    return await Promise.all(invoicePromises);
  }

  async getSubscriptionCoupons(agentSubscriptionId: Id): Promise<Coupon[]> {
    try {
      const subscription = await this.paymentClient.retrieveSubscription(agentSubscriptionId);
      const appliedCoupons: ChargebeeAppliedCoupon[] = subscription.coupons;
      if (!appliedCoupons) {
        return [];
      }
      const couponIds = appliedCoupons.map((coupon) => coupon.coupon_id);
      const coupons: ChargebeeCoupon[] = await this.paymentClient.retrieveCoupons(couponIds);
      const couponPromises = coupons.map((cbCoupon) => {
        const appliedCoupon = appliedCoupons.find((coupon) => coupon.coupon_id === cbCoupon.id);
        return this.modelParser.parseCouponEventData(cbCoupon, appliedCoupon, subscription.cf_organization_id);
      });
      return await Promise.all(couponPromises);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async downloadInvoice(agentInvoiceId: Id): Promise<string> {
    return await this.paymentClient.retrieveInvoicePdf(agentInvoiceId);
  }

  public static getSubscriptionStatus(status: string): SubscriptionStatus {
    // remap chargebee statuses to general statuses, because we have the same
    return status as SubscriptionStatus;
  }
}
