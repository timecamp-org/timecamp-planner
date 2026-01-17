import Amplitude from 'amplitude';

import { get, isNil, set } from 'lodash';
import { LoggerInterface } from '../../../../../infrastructure/logger';
import { Id } from '../../common/identifier';
import { AnyDict } from '../../common/types';
import { UserDbRow } from '../../db/schema';
import { AbstractAnalyticsEngine } from '../AbstractAnalyticsEngine';
import { AnalyticsEngine } from '../AnalyticsEngine';
import { ExtraEventToUserProps, UserTrackerEventJson, UsersAdditionalProperties } from '../types';

export type AmplitudeUserData = {
  user_id: string;
  user_properties?: {
    $set?: any;
    $setOnce?: any;
  };
};
export type AmplitudeEventData = {
  user_id?: string;
  /**
   * miliseconds
   */
  time: number;
  device_id?: string;
  event_type: string;
  insert_id: string;
  ip?: string;
  event_properties?: AnyDict;
};

/**
 * Exports usage tracker events to amplitude.
 *
 * API DOCS: https://developers.amplitude.com/?java#http-api
 */
export class AmplitudeService extends AbstractAnalyticsEngine<AmplitudeUserData, AmplitudeEventData> {
  private amplitude: Amplitude;

  constructor(logger: LoggerInterface, apiKey: string) {
    super(AnalyticsEngine.AMPLITUDE, logger);
    this.amplitude = new Amplitude(apiKey);
  }

  protected convertUserToApiFormat(user: UserDbRow): AmplitudeUserData {
    return {
      user_id: user?.id,
      user_properties: {
        $set: {
          name: `${user.firstName} ${user.lastName}`.trim(),
          email: user.email,
        },
        $setOnce: {
          createdAt: user.createdAt,
        },
      },
    };
  }

  protected async extractUsersPropertiesFromEvents(
    events: UserTrackerEventJson[],
    actorId: Id
  ): Promise<UsersAdditionalProperties> {
    const usersProperties = {};
    const userIds = [];
    events.forEach((event) => {
      const userId = event?.user?.id || actorId;
      if (!userId) {
        return;
      }

      userIds.push(userId);
      ExtraEventToUserProps.forEach((propName) => {
        const propValue = get(event.properties, propName);
        if (!isNil(propValue)) {
          set(usersProperties, `${userId}.setOnce.${propName}`, propValue);
        }
      });
    });

    events.forEach((event) => {
      if (event?.userOrganizationIds && event?.user) {
        set(usersProperties, `${event?.user?.id}.set.workspaceIds`, event.userOrganizationIds);
      }
    });

    return usersProperties;
  }

  protected appendAdditionalPropertiesToUser(
    user: AmplitudeUserData,
    usersProperties: UsersAdditionalProperties
  ): AmplitudeUserData {
    Object.keys(usersProperties).forEach((userId) => {
      const props = usersProperties[userId] || {};
      if (props.setOnce) {
        Object.keys(props.setOnce).forEach((propName) => {
          const propValue = props.setOnce[propName];
          user.user_properties.$setOnce[propName] = propValue;
        });
      }
      if (props.set) {
        Object.keys(props.set).forEach((propName) => {
          const propValue = props.set[propName];
          user.user_properties.$set[propName] = propValue;
        });
      }
    });

    return user;
  }

  protected convertEventToApiFormat(event: UserTrackerEventJson): AmplitudeEventData {
    return {
      user_id: event?.user?.id,
      // Closest we have to device_id
      device_id: event.sessionId,
      event_type: event.name,
      time: event.epoch,
      insert_id: event?.id,
      event_properties: event.properties,
    };
  }

  protected async pushUserData(userData: AmplitudeUserData[], ip: string) {
    await this.amplitude.identify(userData);
  }

  protected async pushEventData(eventData: AmplitudeEventData[], ip: string) {
    const data: (AmplitudeEventData & AmplitudeUserData)[] = eventData.map((d) => ({
      user_id: null,
      device_id: null,
      ...d,
      ip,
    }));

    await this.amplitude.track(data);
  }
}
