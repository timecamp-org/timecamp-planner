import { Id } from '../common/utils/identifier';
import { OrganizationPeopleRole } from '../common/models/domain/OrganizationsModel/types';
import { SubscriptionStatus } from 'models/domain/SubscriptionModel/types';

export interface DataProviderInterface {
  currentUserId: Id;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: number;
  organizationRole: OrganizationPeopleRole;
  phoneNumber?: string;

  planName: string;
  subscriptionStatus: SubscriptionStatus;

  organizationId: Id;
  organizationName: string;
  organizationCreatedAt: number;
  organizationModifiedAt: number;
  currentMonthBill: number;
  organizationUserCount: number;
  extensionsEnabled: string;
}

export interface LivechatDataInterface {
  user_id: Id;
  email: string;
  name: string;
  phone_number: string;
  created_at: string;
  organization_id: Id;
  organization_name: string;
  organization_role: OrganizationPeopleRole;
  organization_size: number;
  subscription_status: string;
  organization_created_at: string;
  plan: string;
  monthly_spend: number;
  extensions_enabled: string;
}

