import { inject, injectable } from 'inversify'

import Table, { ForeignKey, UniqueKey } from '../../db/Table'
import { Id } from '../../common/identifier'
import { FeatureCode, SavePlanFeatureStatus, SaveSubscriptionFeatureStatus, SubscriptionFeature, PaymentOptions } from '../types'
import { SubscriptionFeatureProviderInterface } from '../interfaces/SubscriptionFeatureProviderInterface'
import { LoggerInterface } from '../../../../../infrastructure/logger'
import { InfrastructureModule } from '../../../../../infrastructure/InfrastructureModule'
import { PaymentModule } from '../PaymentModule'
import { SubscriptionProviderInterface } from '../interfaces/SubscriptionProviderInterface'
import { violatesForeignKey, violatesUniqueKey } from '../../../../../utils'
import { get } from 'lodash'
import { SubscriptionPlanProviderInterface } from '../interfaces/SubscriptionPlanProviderInterface';
import { DbModule } from '../../db/DbModule'
import { ConnectionInterface } from '../../db/ConnectionInterface'

@injectable()
export class SubscriptionFeatureProvider implements SubscriptionFeatureProviderInterface {

  protected logger: LoggerInterface
  protected subscriptionProvider: SubscriptionProviderInterface
  protected planProvider: SubscriptionPlanProviderInterface
  protected options: PaymentOptions

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
      logger: LoggerInterface,
    @inject(PaymentModule.SubscriptionProviderInterface)
      subscriptionProvider: SubscriptionProviderInterface,
    @inject(PaymentModule.SubscriptionPlanProviderInterface)
      planProvider: SubscriptionPlanProviderInterface,
    @inject(PaymentModule.PaymentOptions)
      options: PaymentOptions,
    @inject(DbModule.ConnectionInterface)
      private connection: ConnectionInterface
  ) {
    this.logger = logger
    this.subscriptionProvider = subscriptionProvider
    this.planProvider = planProvider
    this.options = options
  }

  async checkForOrganizationSubscriptionFeature(
    organizationId: Id,
    featureCode: FeatureCode,
    checkerFn: (subscriptionFeature: SubscriptionFeature) => any
      = (subscriptionFeature) => ({
      isPermitted: subscriptionFeature.isAllowed
    })
  ): Promise<any> {
    const organizationSubscriptionFeature = await this.getOrganizationSubscriptionFeature(organizationId, featureCode)
    return checkerFn(organizationSubscriptionFeature)
  }

  async getOrganizationSubscriptionFeature(organizationId: Id, featureCode: FeatureCode): Promise<SubscriptionFeature> {
    return this.getDefaultSubscriptionFeature()
  }

  private getDefaultSubscriptionFeature(): SubscriptionFeature {
    return {
      isAllowed: true,
      isUnlimited: true,
      value: Number.MAX_SAFE_INTEGER,
    }
  }

  private async getPlanFeature(planId: Id, featureCode: FeatureCode): Promise<SubscriptionFeature|null> {
    const planFeature = await this.connection.getQueryBuilder()
      .from(Table.PAYMENTS_PLAN_FEATURE)
      .select('value')
      .where('planId', planId)
      .where('code', featureCode)
      .first()

    return get(planFeature, 'value', null)
  }

  private async getSubscriptionFeature(subscriptionId: Id, featureCode: FeatureCode): Promise<SubscriptionFeature|null> {
    const subscriptionFeature = await this.connection.getQueryBuilder()
      .from(Table.PAYMENTS_SUBSCRIPTION_FEATURE)
      .select('value')
      .where('subscriptionId', subscriptionId)
      .where('code', featureCode)
      .first()

    return get(subscriptionFeature, 'value', null)
  }

  async savePlanFeature(planId: Id, featureCode: FeatureCode, value: SubscriptionFeature) {
    try {
      await this.connection.getQueryBuilder()
        .insert({
          planId,
          code: featureCode,
          value,
        })
        .into(Table.PAYMENTS_PLAN_FEATURE)

      return {
        status: SavePlanFeatureStatus.OK,
      }
    } catch (error) {
      if (violatesUniqueKey(error, UniqueKey.PLAN_FEATURE_PK)) {
        return {
          status: SavePlanFeatureStatus.PLAN_ALREADY_EXISTS
        }
      } else if (violatesForeignKey(error, ForeignKey.PLAN_FEATURE_PLAN_ID_FK)) {
        return {
          status: SavePlanFeatureStatus.PLAN_NOT_FOUND,
        }
      } else {
        throw error
      }
    }
  }


  async saveSubscriptionFeature(subscriptionId: Id, featureCode: FeatureCode, value: SubscriptionFeature) {
    try {
      await this.connection.getQueryBuilder()
        .insert({
          subscriptionId,
          code: featureCode,
          value,
        })
        .into(Table.PAYMENTS_SUBSCRIPTION_FEATURE)

      return {
        status: SaveSubscriptionFeatureStatus.OK,
      }
    } catch (error) {
      if (violatesUniqueKey(error, UniqueKey.SUBSCRIPTION_FEATURE_PK)) {
        return {
          status: SaveSubscriptionFeatureStatus.SUBSCRIPTION_ALREADY_EXISTS
        }
      } else if (violatesForeignKey(error, ForeignKey.SUBSCRIPTION_FEATURE_SUBSCRIPTION_ID_FK)) {
        return {
          status: SaveSubscriptionFeatureStatus.SUBSCRIPTION_NOT_FOUND,
        }
      } else {
        throw error
      }
    }
  }

}
