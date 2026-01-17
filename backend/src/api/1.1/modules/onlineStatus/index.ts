import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { OnlineStatusModule } from './OnlineStatusModule';
import { UserSessionService } from './UserSessionService';
import { UserSessionServiceInterface } from './UserSessionServiceInterface';
import { UserOnlineFeedPlugin } from './UserOnlineFeedPlugin';
import { UserSessionFeedServicePlugin } from './UserSessionFeedServicePlugin';
import { FeedServicePluginInterface } from '../feed/interfaces/FeedServicePluginInterface';
import { FeedModule } from '../feed/FeedModule';

export const onlineStatusModule: ModuleLoaderType = kernel => {
  kernel.bind<UserSessionServiceInterface>(OnlineStatusModule.UserSessionServiceInterface).to(UserSessionService).inSingletonScope();
  kernel.bind<FeedServicePluginInterface>(FeedModule.FeedServicePluginInterface).to(UserOnlineFeedPlugin);
  kernel.bind<FeedServicePluginInterface>(FeedModule.FeedServicePluginInterface).to(UserSessionFeedServicePlugin);
  kernel.bind(FeedModule.FeedPluginOptions).toConstantValue({
    setAllOfflineOnStartup: true,
  })
    .whenInjectedInto(UserSessionFeedServicePlugin)
}
