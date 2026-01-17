import { inject, injectable } from 'inversify';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { Id } from '../common/identifier';
import { AnalyticsModule } from './AnalyticsModule';
import AnalyticsEngineServiceInterface from './interfaces/AnalyticsEngineServiceInterface';
import { UsageTrackerServiceInterface } from './interfaces/UsageTrackerServiceInterface';
import { HandleEventResult, HandleEventStatus, UserTrackerEventJson } from './types';

@injectable()
export class UsageTrackerService implements UsageTrackerServiceInterface {
  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
    @inject(AnalyticsModule.AnalyticsEngineServiceInterface)
    private analyticsEngines: AnalyticsEngineServiceInterface[]
  ) {}

  public async handleUsageTrackerEvents(
    usageTrackerEvents: UserTrackerEventJson[],
    userId: Id,
    userIp: string
  ): Promise<HandleEventResult[]> {
    try {
      const sendEventsPromises = this.analyticsEngines.map((engine) =>
        engine.pushEventsWithActor(usageTrackerEvents, userId, userIp)
      );

      await Promise.all(sendEventsPromises);

      return usageTrackerEvents.map((event) => {
        return {
          id: event.id,
          status: HandleEventStatus.OK,
        };
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
