import { inject, injectable } from 'inversify';
import { SubscriptionInOrganizationDbRow } from '../db/schema';
import { PaymentModule } from './PaymentModule';
import { SubscriptionPlanProviderInterface } from './interfaces/SubscriptionPlanProviderInterface';
import { SubscriptionServiceInterface } from './interfaces/SubscriptionServiceInterface';
import {
  AgentCode,
  GetSubscriptionViewDataResult,
  GetSubscriptionViewDataStatus,
  PaymentOptions,
  SubscriptionJson,
  SubscriptionPlanCode,
  SubscriptionStatus,
} from './types';

import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { CommonModule } from '../common/CommonModule';
import { Id, IdGeneratorInterface } from '../common/identifier';
import { TimeServiceInterface } from '../common/time/TimeServiceInterface';
import { OrganizationsModule } from '../organizations/OrganizationsModule';
import { UserInOrganizationProviderInterface } from '../organizations/interfaces/UserInOrganizationProviderInterface';
import { ProjectsModule } from '../projects/ProjectsModule';
import { GuestInProjectProviderInterface } from '../projects/interfaces/GuestInProjectProviderInterface';
import { AgentProviderInterface } from './interfaces/AgentProviderInterface';
import { ExtensionConfigFoSubscriptionPlanProviderInterface } from './interfaces/ExtensionConfigFoSubscriptionPlanProviderInterface';
import { PaymentServiceInterface } from './interfaces/PaymentServiceInterface';
import { SubscriptionProviderInterface } from './interfaces/SubscriptionProviderInterface';

@injectable()
export class SubscriptionService implements SubscriptionServiceInterface {
  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
    @inject(PaymentModule.SubscriptionPlanProviderInterface)
    private planProvider: SubscriptionPlanProviderInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    private userInOrganizationProvider: UserInOrganizationProviderInterface,
    @inject(PaymentModule.SubscriptionProviderInterface)
    private subscriptionProvider: SubscriptionProviderInterface,
    @inject(PaymentModule.AgentProviderInterface)
    private agentProvider: AgentProviderInterface,
    @inject(PaymentModule.PaymentServiceInterface)
    private paymentService: PaymentServiceInterface,
    @inject(PaymentModule.ExtensionConfigFoSubscriptionPlanProviderInterface)
    private extensionConfigForSubscriptionPlanProvider: ExtensionConfigFoSubscriptionPlanProviderInterface,
    @inject(PaymentModule.PaymentOptions)
    private options: PaymentOptions,
    @inject(ProjectsModule.GuestInProjectProviderInterface)
    private guestInProjectProvider: GuestInProjectProviderInterface,
    @inject(CommonModule.TimeServiceInterface)
    private timeService: TimeServiceInterface,
    @inject(PaymentModule.PaymentOptions)
    private paymentOptions: PaymentOptions,
    @inject(CommonModule.IdGeneratorInterface)
    private idGenerator: IdGeneratorInterface<Id>
  ) {}

  async isSubscriptionActiveAndNotFree(
    subscription: SubscriptionInOrganizationDbRow,
    trx?: Transaction
  ): Promise<boolean> {
    void subscription;
    void trx;
    return true;
  }

  async getAvailableGuestSeatsInOrganization(organizationId: Id, trx?: Transaction): Promise<number> {
    void organizationId;
    void trx;
    return Number.MAX_SAFE_INTEGER;
  }

  async getAvailableMemberSeatsInOrganization(organizationId: Id, trx?: Transaction): Promise<number> {
    void organizationId;
    void trx;
    return Number.MAX_SAFE_INTEGER;
  }

  async getSubscriptionViewData(organizationId: Id): Promise<GetSubscriptionViewDataResult> {
    const [plans, currentSubscription] = await Promise.all([
      this.planProvider.getSubscriptionPlans(),
      this.subscriptionProvider.getSubscriptionForOrganizationId(organizationId),
    ]);

    let coupons = [];

    if (currentSubscription && currentSubscription.agentSubscriptionId) {
      const agent = await this.agentProvider.getAgentById(currentSubscription.agentId);
      try {
        coupons = await this.paymentService.getSubscriptionCoupons(agent.code, currentSubscription.agentSubscriptionId);
      } catch (error) {
        this.logger.error(error);
      }
    }

    return {
      status: GetSubscriptionViewDataStatus.OK,
      currentSubscription,
      plans,
      coupons,
    };
  }

  async isSubscriptionActiveAndNotFreeForOrganization(organizationId: Id, trx?: Transaction): Promise<boolean> {
    const organizationSubscription = await this.subscriptionProvider.getSubscriptionForOrganizationId(
      organizationId,
      trx
    );
    return await this.isSubscriptionActiveAndNotFree(organizationSubscription, trx);
  }

  async getUserOwnedOrganizationSubscriptions(userId: Id): Promise<SubscriptionInOrganizationDbRow[]> {
    const userOwnedOrganizationIds = await this.userInOrganizationProvider.getUserOwnedOrganizationIds(userId);
    return await this.subscriptionProvider.getSubscriptionsForOrganizationIds(userOwnedOrganizationIds);
  }

  async isExtensionAvailableForOrganization(extensionId: Id, organizationId: Id): Promise<boolean> {
    const organizationSubscription = await this.subscriptionProvider.getSubscriptionForOrganizationId(organizationId);

    let planId = this.options.defaultFreePlanId;

    if (organizationSubscription) {
      const isSubscriptionActive = await this.isSubscriptionActiveAndNotFree(organizationSubscription);
      if (isSubscriptionActive) {
        planId = organizationSubscription.planId;
      }
    }

    await this.extensionConfigForSubscriptionPlanProvider.getExtensionConfigForPlan(extensionId, planId);
    return true;
  }

  async createTrialSubscription(organizationId: Id, trx: Transaction): Promise<SubscriptionInOrganizationDbRow> {
    const agent = await this.agentProvider.getAgent(AgentCode.CHARGEBEE, trx);
    const plan = await this.planProvider.getSubscriptionPlan(SubscriptionPlanCode.SUBSCRIPTION_TYPE_PRO_YEARLY, trx);

    const now = this.timeService.getCurrentTime();

    const trialSubscription: SubscriptionJson = {
      id: this.idGenerator.generateId(),
      organizationId,
      agentId: agent.id,
      billingPeriod: plan.billingPeriod,
      createdAt: now,
      expiresAt: this.timeService.addDays(now, this.paymentOptions.defaultTrialDays),
      planId: plan.id,
      seatCount: this.paymentOptions.defaultTrialSeatCount,
      status: SubscriptionStatus.STATUS_IN_TRIAL,
    };

    return await this.subscriptionProvider.createSubscription(trialSubscription, trx);
  }
}
