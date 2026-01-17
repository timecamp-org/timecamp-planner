import { OrganizationPeopleRole } from 'models/domain/OrganizationsModel/types';
import { SubscriptionInterface } from 'models/domain/SubscriptionModel/types';
import { Id, LoggerInterface } from '../types';

export interface UserTrackerOptionsInterface {
  timestampNowFunction?: () => number;
  logger?: LoggerInterface;
  trackUrl?: string;
  sendIntervalMiliseconds?: number;
  browser?: string;
  platform?: string;
  isUserTrackerEnabled?: boolean;
}

export interface EventProperties {
  browser: string;
  platform: string;
}

export interface TrackedUser {
  id: Id;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: number;
  phoneNumber?: string;
  role?: string;
}

export interface TrackerEvent {
  id: Id;
  name: string;
  epoch: number;
  properties?: EventProperties;
  user?: TrackedUser;
  sessionId?: Id;
  organizationId?: Id;
  userOrganizationIds?: Id[];
  subscriptionStatus?: SubscriptionStatus;
  subscription?: TrackedSubscription;
  userRole?: OrganizationPeopleRole;
}

export type TrackerCallback = (...args: any[]) => void;

export enum SubscriptionStatus {
  ACTIVE = 'active',
  IN_TRIAL = 'in_trial',
  NON_RENEWING = 'non_renewing',
  CANCELLED = 'cancelled',
  FUTURE = 'future',
}

export type TrackedSubscription = SubscriptionInterface & { planCode: string };
