import * as async from 'async';
import { boundClass } from 'autobind-decorator';
import isDev from 'common/utils/isDevEnv';
import { has, isEmpty, pick } from 'lodash';
import { OrganizationPeopleRole } from 'models/domain/OrganizationsModel/types';
import { AnyDict, Id, LoggerInterface } from '../types';
import { FetchOptionsInterface, HttpAgentInterface } from '../utils/HttpAgent';
import generateUuid from '../utils/generateUuid';
import timestampNow from '../utils/timestampNow';
import { QueueInterface } from './interfaces/QueueInterface';
import { TrackerClient } from './interfaces/TrackerInterface';
import { UserTrackerInterface } from './interfaces/UserTrackerInterface';
import { TrackedSubscription, TrackedUser, TrackerEvent, UserTrackerOptionsInterface } from './types';

export * from './types';

const defaultOptions: UserTrackerOptionsInterface = {
  timestampNowFunction: timestampNow,
  logger: console,
  trackUrl: '/usage-tracker',
  sendIntervalMiliseconds: 5_000,
  isUserTrackerEnabled: true,
};

@boundClass
class UserTracker implements UserTrackerInterface {
  private options: UserTrackerOptionsInterface;
  private logger: LoggerInterface;
  private isUploading: boolean = false;
  private isUserTrackerEnabled: boolean = true;
  private user: TrackedUser;
  private userRole: OrganizationPeopleRole;
  private sessionId: Id;
  private organizationId: Id;
  private userOrganizationIds: Id[];
  private subscription: TrackedSubscription;
  private queue: QueueInterface<TrackerEvent>;
  private httpAgent: HttpAgentInterface;
  private invalidEvents: TrackerEvent[] = [];

  constructor(
    httpAgent: HttpAgentInterface,
    queue: QueueInterface<TrackerEvent>,
    userTrackerOptions: UserTrackerOptionsInterface,
    private trackerClients?: TrackerClient[],
  ) {
    if (!httpAgent) {
      throw new Error('HttpClient in UserTracker is missing');
    }

    if (!queue) {
      throw new Error('Queue in UserTracker is missing');
    }

    this.options = Object.assign({}, defaultOptions, userTrackerOptions);
    this.logger = this.options.logger;
    this.isUserTrackerEnabled = this.options.isUserTrackerEnabled;
    this.queue = queue;
    this.httpAgent = httpAgent;
  }

  private startUploading(error: Error) {
    // eslint-disable-line
    if (error) {
      this.logger.error(error);
      return false;
    }

    if (this.isUploading) {
      return false;
    }

    this.isUploading = true;
    setTimeout(() => {
      this.queue.getAll(this.sendEvents);
    }, this.options.sendIntervalMiliseconds);
  }

  private sendEvents(error: Error, events: TrackerEvent[]) {
    if (error || events.length === 0) {
      return this.finishUploading(error);
    }

    const validEvents = events.filter(this.validateEvent);

    try {
      this.trackerClients?.forEach((client) => client.trackUserEvents(validEvents));
    } catch (e) {
      this.logger.error(new Error(`Tracker error ${e}`));
    }

    const eventsPutRequest = this.createEventsPutRequest(validEvents);

    if (!eventsPutRequest) {
      return false;
    }

    this.httpAgent.request(this.options.trackUrl, eventsPutRequest, async (requestError, response) => {
      if (requestError || response.status !== 200) {
        return await this.createRequestError(requestError, response);
      }

      return this.removeEventsFromQueue(events);
    });
  }

  private validateEvent(event: TrackerEvent): boolean {
    const isValid = Boolean(
      event &&
        event.name &&
        event.id &&
        event.epoch &&
        has(event.user, 'id') &&
        event.userRole &&
        has(event.subscription, 'status'),
    );

    return isValid;
  }

  private removeEventsFromQueue(events: TrackerEvent[]) {
    async.each(
      events,
      (event, callback) => {
        this.queue.remove(event, callback);
      },
      (error) => {
        if (error) {
          return this.finishUploading(error);
        }

        return setTimeout(() => {
          this.queue.getAll(this.sendEvents);
        }, this.options.sendIntervalMiliseconds);
      },
    );
  }

  private async createRequestError(requestError: Error, response: Response) {
    // eslint-disable-line
    if (requestError) {
      return this.finishUploading(requestError);
    }

    try {
      const responseJson = await response.json();
      this.finishUploading(responseJson);
    } catch (error) {
      this.finishUploading(error);
    }
  }

  private finishUploading(error: Error) {
    if (error) {
      this.logger.error(error);
    }

    this.isUploading = false;
  }

  private createEventsPutRequest(events: TrackerEvent[]): FetchOptionsInterface {
    try {
      return {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }, null, 2),
        credentials: 'include',
      };
    } catch (error) {
      this.finishUploading(error);
      return null;
    }
  }

  track = (eventName: string, eventProperties: AnyDict = {}): boolean => {
    if (isDev()) {
      console.log(`Tracked event: ${eventName}`, eventProperties);
    }

    if (!this.isUserTrackerEnabled) {
      return false;
    }

    if (!eventName) {
      this.logger.error(new Error(`Unrecognized UserTracker event: ${eventName}`));
      return false;
    }

    const event = this.createEvent({ eventName, eventProperties });
    if (!this.validateEvent(event)) {
      this.logger.log(`User event:${eventName} postponed invalid body ${event}`);
      this.invalidEvents.push(event);

      return;
    }

    this.recreateInvalidEvents();

    this.queue.push(event, this.startUploading);
  };

  private recreateInvalidEvents() {
    if (isEmpty(this.invalidEvents)) {
      return;
    }

    const events = this.invalidEvents.map(({ name, epoch, properties, id }) =>
      this.createEvent({ id, eventName: name, eventProperties: properties, epoch }),
    );

    if (events.map(this.validateEvent).includes(false)) {
      return;
    }

    events.forEach((ev) => this.queue.push(ev, () => {}));
    this.invalidEvents = [];
  }

  private createEvent = ({
    eventName,
    eventProperties = {},
    epoch,
    id,
  }: {
    eventName: string;
    eventProperties: AnyDict;
    id?: string;
    epoch?: number;
  }): TrackerEvent => {
    const { browser, platform } = this.options;

    return {
      id: id || generateUuid(),
      epoch: epoch || this.options.timestampNowFunction(), // key for timestampNowFunction is named epoch because of backend naming convention (on BE epoch means time in milliseconds)
      name: eventName,
      properties: Object.assign({}, eventProperties, {
        browser,
        platform,
        subscriptionStatus: this.subscription?.status,
      }),
      user: this.user,
      sessionId: this.sessionId,
      organizationId: this.organizationId,
      userOrganizationIds: this.userOrganizationIds,
      subscriptionStatus: this.subscription?.status,
      subscription: this.subscription,
      userRole: this.userRole,
    };
  };

  setUser(newUser: TrackedUser) {
    this.user = pick(newUser, ['id', 'createdAt', 'firstName', 'lastName', 'email', 'phoneNumber']);

    if (this.options.isUserTrackerEnabled) {
      this.trackerClients.forEach((tracker) => tracker.setUser(this.user));
    }
  }

  setUserRole(role: OrganizationPeopleRole) {
    this.userRole = role;
  }

  setSessionId(newSessionId: Id) {
    this.sessionId = newSessionId;
  }

  setOrganizationId(newOrganizationId: Id) {
    this.organizationId = newOrganizationId;
  }

  setUserOrganizationIds(newUserOrganizationIds: Id[]) {
    this.userOrganizationIds = newUserOrganizationIds;
  }

  setSubscription(newSubscription: TrackedSubscription) {
    this.subscription = newSubscription;
  }

  enable() {
    this.isUserTrackerEnabled = true;
  }

  disable() {
    this.isUserTrackerEnabled = false;
  }

  get userId() {
    return this.user.id;
  }
}

export default UserTracker;
