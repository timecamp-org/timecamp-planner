import { inject, injectable } from 'inversify';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { TagLoggerFactory } from '../../../../infrastructure/logger';
import { CommonModule } from '../common/CommonModule';
import { TimeServiceInterface } from '../common/time/TimeServiceInterface';
import { OrganizationsModule } from '../organizations/OrganizationsModule';
import { UserInOrganizationProviderInterface } from '../organizations/interfaces/UserInOrganizationProviderInterface';
import { UserServiceInterface } from '../users/UserServiceInterface';
import { UsersModule } from '../users/UsersModule';
import { AnalyticsEngine } from './AnalyticsEngine';
import { AnalyticsModule } from './AnalyticsModule';
import { ShipmentLog } from './ShipmentLog';
import { AmplitudeService } from './providers/AmplitudeService';
import { AnalyticsConfigType } from './types';

@injectable()
export class AnalyticsEngineFactory {
  constructor(
    @inject(InfrastructureModule.TagLoggerFactory)
    protected logFactory: TagLoggerFactory,
    @inject(AnalyticsModule.ShipmentLog)
    protected shipmentLog: ShipmentLog,
    @inject(UsersModule.UserServiceInterface)
    protected userService: UserServiceInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    protected userInOrganizationProvider: UserInOrganizationProviderInterface,
    @inject(CommonModule.TimeServiceInterface)
    protected timeService: TimeServiceInterface,
    @inject(AnalyticsModule.AnalyticsConfigType)
    private config: AnalyticsConfigType
  ) {}

  public createAnalyticsEngine(engine: AnalyticsEngine) {
    switch (engine) {
      case AnalyticsEngine.AMPLITUDE:
        return new AmplitudeService(this.getEngineLogger(engine), this.config.tokens[engine]);
      default:
        throw new Error(`Unsupported analytics engine: ${engine}`);
    }
  }

  private getEngineLogger(engine: AnalyticsEngine) {
    return this.logFactory.create(`Analytics:${engine}`);
  }
}
