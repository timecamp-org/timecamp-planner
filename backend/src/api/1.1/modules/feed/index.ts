import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { FeedModule } from './FeedModule';
import { FeedService } from './FeedService';
import { PostgresFeedPlugin } from './PostgresFeedPlugin';
import { FeedHandler } from '../../controllers/FeedController';
import { FeedServer } from '../../../../infrastructure/FeedServer';
import { FeedServicePluginInterface } from './interfaces/FeedServicePluginInterface';
import { FeedServiceInterface } from './interfaces/FeedServiceInterface';

export const feedModule : ModuleLoaderType = kernel => {
  kernel.bind<FeedServiceInterface>(FeedModule.FeedServiceInterface).to(FeedService).inSingletonScope();
  kernel.bind<FeedServicePluginInterface>(FeedModule.FeedServicePluginInterface).to(PostgresFeedPlugin);
  kernel.bind(FeedModule.FeedServer).to(FeedServer);
  kernel.bind(FeedModule.FeedHandler).to(FeedHandler);
}
