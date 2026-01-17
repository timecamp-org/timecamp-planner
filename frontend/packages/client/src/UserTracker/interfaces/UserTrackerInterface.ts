import { AnyDict } from 'common/types';
import { Id } from 'common/utils/identifier';
import { OrganizationPeopleRole } from 'models/domain/OrganizationsModel/types';
import { TrackedSubscription, TrackedUser } from '../types';

export interface UserTrackerInterface {
  track(eventName: string, eventProperties?: AnyDict): boolean;

  setUser(newUser: TrackedUser);

  setUserRole(role: OrganizationPeopleRole);

  setSessionId(newSessionId: Id);

  setOrganizationId(newOrganizationId: Id);

  setUserOrganizationIds(newUserOrganizationIds: Id[]);

  setSubscription(newSubscription: TrackedSubscription);

  enable();

  disable();
}
