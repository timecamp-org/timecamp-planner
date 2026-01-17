import { Id } from '../../common/identifier'
import {
  FeatureCode,
  SavePlanFeatureResult,
  SaveSubscriptionFeatureResult,
  SubscriptionFeature,
} from '../types'

export interface SubscriptionFeatureProviderInterface {
  getOrganizationSubscriptionFeature(organizationId: Id, featureCode: FeatureCode): Promise<SubscriptionFeature>

  checkForOrganizationSubscriptionFeature(organizationId: Id, featureCode: FeatureCode, checkerFn: (SubscriptionFeature) => any): Promise<any>

  savePlanFeature(planId: Id, featureCode: FeatureCode, value: SubscriptionFeature): Promise<SavePlanFeatureResult>

  saveSubscriptionFeature(subscriptionId: Id, featureCode: FeatureCode, value: SubscriptionFeature): Promise<SaveSubscriptionFeatureResult>
}