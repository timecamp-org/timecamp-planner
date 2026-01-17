import { boundClass } from 'autobind-decorator';
import EventEmitter from 'eventemitter3';
import { OrganizationPeopleRole } from 'models/domain/OrganizationsModel/types';
import { TrackedSubscription, TrackedUser } from './UserTracker/types';
import { UserContextEvents } from './types';

export interface UserContextInterface {
  getUserId(): string;
  getUser(): TrackedUser;
  setUser(user: TrackedUser): void;
  getSubscription(): TrackedSubscription;
  getOrganizationId(): string;
  getUserOrganizationIds(): string[];
  setOrganizationId(newOrganizationId: string);
  setUserOrganizationIds(newUserInOrganizationId: string[]);
  setUserRole(role: OrganizationPeopleRole);
  setSubscription(newSubscription: TrackedSubscription);
  getEventEmitter(): EventEmitter;
}

@boundClass
class UserContext implements UserContextInterface {
  private organizationId: string;
  private userOrganizationIds: string[];
  private user: TrackedUser;
  private userRole: OrganizationPeopleRole;
  private eventEmitter: EventEmitter;
  private subscription: TrackedSubscription;

  constructor(EventEmitterContructor = EventEmitter) {
    this.eventEmitter = new EventEmitterContructor();
  }

  setUser(user: TrackedUser) {
    this.user = user;
    this.eventEmitter.emit(UserContextEvents.USER_CHANGED, user);
  }

  setUserRole(role: OrganizationPeopleRole) {
    this.userRole = role;
    this.eventEmitter.emit(UserContextEvents.USER_ROLE_CHANGED, role);
  }

  setSubscription(newSubscription: TrackedSubscription) {
    this.subscription = newSubscription;
    this.eventEmitter.emit(UserContextEvents.SUBSCRIPTION_CHANGED, newSubscription);
  }

  setOrganizationId(newOrganizationId: string) {
    this.organizationId = newOrganizationId;
    this.eventEmitter.emit(UserContextEvents.ORGANIZATION_CHANGED, newOrganizationId);
  }

  setUserOrganizationIds(newUserOrganizationIds: string[]) {
    this.userOrganizationIds = newUserOrganizationIds;
    this.eventEmitter.emit(UserContextEvents.USER_ORGANIZATIONS_CHANGED, newUserOrganizationIds);
  }

  getOrganizationId(): string {
    return this.organizationId;
  }

  getUserOrganizationIds(): string[] {
    return this.userOrganizationIds || [];
  }

  getSubscription(): TrackedSubscription {
    return this.subscription;
  }

  getUser(): TrackedUser {
    return { ...this.user };
  }

  getUserRole(): OrganizationPeopleRole {
    return this.userRole;
  }

  getUserId(): string {
    return this.user.id;
  }

  getEventEmitter() {
    return this.eventEmitter;
  }
}

export default UserContext;
