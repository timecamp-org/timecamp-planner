import { Id } from '../common/identifier';
import { AnyDict } from '../common/types';
import { AnalyticsEngine } from './AnalyticsEngine';

export const ExtraEventToUserProps = ['referrer', 'utm_source', 'phone'];

export interface UserAdditionalProperties {
  set?: AnyDict;
  setOnce?: AnyDict;
}

export interface UsersAdditionalProperties {
  [userId: string]: UserAdditionalProperties;
}

export type AnalyticsConfigType = {
  tokens: { [engine in AnalyticsEngine]: string };
  storeLogShipment: boolean;
};

export enum HandleEventStatus {
  OK,
  EVENT_ALREADY_EXISTS,
}

export type UserTrackerEventJson = {
  id: Id;
  name: string;
  epoch: number;
  user?: {
    id: Id;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
  };
  organizationId?: Id;
  userOrganizationIds?: Id[];
  properties: {
    [name: string]: string | number | boolean;
  };
  sessionId: string;
};

export type StoreEventsResult = {
  storedEvents: UserTrackerEventJson[];
  eventIdsAlreadyInDb: Id[];
};

export type HandleEventResult = {
  status: HandleEventStatus;
  id: Id;
};

export enum FeedbackType {
  SUBSCRIPTION_CANCELATION = 'subscription_cancelation',
  ACCOUNT_DELETED = 'account_deleted',
}

export enum SetUserFeedbackStatus {
  OK,
  USER_NOT_FOUND,
}

export type FeedbackJson = AnyDict;
