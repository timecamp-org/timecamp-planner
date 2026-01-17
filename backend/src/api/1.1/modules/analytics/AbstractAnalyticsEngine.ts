import { inject } from 'inversify';
import { uniq } from 'lodash';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { Id } from '../common/identifier';
import { UserDbRow } from '../db/schema';
import { AnalyticsEngine } from './AnalyticsEngine';
import AnalyticsEngineServiceInterface from './interfaces/AnalyticsEngineServiceInterface';
import { ShipmentLog } from './ShipmentLog';
import { UsersAdditionalProperties, UserTrackerEventJson } from './types';

export abstract class AbstractAnalyticsEngine<UserDataType, EventDataType> implements AnalyticsEngineServiceInterface {
  protected shipmentLog: ShipmentLog;
  protected engine: AnalyticsEngine;
  protected logger: LoggerInterface;

  constructor(engine: AnalyticsEngine, @inject(InfrastructureModule.LoggerInterface) logger: LoggerInterface) {
    this.engine = engine;
    this.logger = logger;
  }

  async pushEventsWithActor(events: UserTrackerEventJson[], actorId: Id, actorIp: string): Promise<void> {
    const userData = await this.getUsersFromEvents(events, actorId);

    await this.pushUserData(userData, actorIp);

    const eventData = events.map<EventDataType>(this.convertEventToApiFormat.bind(this));

    await this.pushEventData(eventData, actorIp);
  }

  protected async getUsersFromEvents(events: UserTrackerEventJson[], actorId: Id): Promise<UserDataType[]> {
    const users = uniq(events.map((event) => event?.user)).filter((user) => !!user?.id);

    if (users.length === 0) {
      return [];
    }

    const convertedUsers = users.map(this.convertUserToApiFormat.bind(this));

    const usersAdditionalProperties = await this.extractUsersPropertiesFromEvents(events, actorId);

    return convertedUsers.map((user: UserDataType) =>
      this.appendAdditionalPropertiesToUser(user, usersAdditionalProperties)
    );
  }

  protected abstract pushUserData(userData: UserDataType[], ip: string): Promise<void>;
  protected abstract pushEventData(eventData: EventDataType[], ip: string): Promise<void>;

  /**
   * Converts user db data to json (or other format) required by specific API.
   *
   * @param user
   */
  protected abstract convertUserToApiFormat(user: UserDbRow): UserDataType;

  /**
   * Converts event data to format required by analytics API.
   *
   * @param event
   */
  protected abstract convertEventToApiFormat(event: UserTrackerEventJson): EventDataType;

  /**
   * Extracts event properties that must be saved to user properties.
   *
   * @param user
   */
  protected abstract extractUsersPropertiesFromEvents(
    events: UserTrackerEventJson[],
    actorId: Id
  ): Promise<UsersAdditionalProperties>;

  /**
   * Appends additional event properties to user data.
   *
   * @param user
   */
  protected abstract appendAdditionalPropertiesToUser(
    user: UserDataType,
    additionalProperties: UsersAdditionalProperties
  ): UserDataType;
}
