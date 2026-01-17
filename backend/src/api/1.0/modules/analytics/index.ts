import { ModuleLoaderType } from '../../../../ModuleLoaderType';
import config from '../../../../config';
import { AnalyticsEngine } from './AnalyticsEngine';
import { AnalyticsEngineFactory } from './AnalyticsEngineFactory';
import { AnalyticsModule } from './AnalyticsModule';
import { AnalyticsService } from './AnalyticsService';
import { ShipmentLog } from './ShipmentLog';
import { UsageTrackerService } from './UsageTrackerService';
import AnalyticsEngineServiceInterface from './interfaces/AnalyticsEngineServiceInterface';
import { UsageTrackerServiceInterface } from './interfaces/UsageTrackerServiceInterface';
import { UserFeedbackProvider } from './providers/UserFeedbackProvider';
import { AnalyticsConfigType } from './types';

export const analyticsModule: ModuleLoaderType = (kernel) => {
  kernel.bind<AnalyticsEngineFactory>(AnalyticsModule.AnalyticsEngineFactory).to(AnalyticsEngineFactory);
  kernel
    .bind(AnalyticsModule.AnalyticsEngineServiceInterface)
    .toDynamicValue((ctx) => {
      const analyticsFactory: AnalyticsEngineFactory = ctx.container.get<AnalyticsEngineFactory>(
        AnalyticsModule.AnalyticsEngineFactory
      );
      const engines: AnalyticsEngineServiceInterface[] = [];

      const amplitudeToken = (config.analytics.tokens.amplitude || '').trim();
      const hasAmplitudeToken = amplitudeToken.length > 0 && !['undefined', 'null'].includes(amplitudeToken.toLowerCase());

      if (hasAmplitudeToken) {
        engines.push(analyticsFactory.createAnalyticsEngine(AnalyticsEngine.AMPLITUDE));
      }

      return engines;
    })
    .whenInjectedInto(UsageTrackerService);
  kernel.bind(AnalyticsModule.ShipmentLog).to(ShipmentLog);
  kernel.bind<UsageTrackerServiceInterface>(AnalyticsModule.UsageTrackerServiceInterface).to(UsageTrackerService);
  kernel.bind<AnalyticsConfigType>(AnalyticsModule.AnalyticsConfigType).toConstantValue(config.analytics);
  kernel.bind(AnalyticsModule.UserFeedbackProviderInterface).to(UserFeedbackProvider);
  kernel.bind(AnalyticsModule.AnalyticsServiceInterface).to(AnalyticsService);
};
