import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { UserStatusModule } from './UserStatusModule';
import { UserStatusProviderInterface } from './interfaces/UserStatusProviderInterface';
import { UserStatusServiceInterface } from './interfaces/UserStatusServiceInterface';
import { UserStatusProvider } from './UserStatusProvider';
import { UserStatusService } from './UserStatusService';
import { UserStatusResetCronJob } from './UserStatusResetCronJob';

export const userStatusModule : ModuleLoaderType = kernel => {
  kernel.bind<UserStatusProviderInterface>(UserStatusModule.UserStatusProviderInterface).to(UserStatusProvider);
  kernel.bind<UserStatusServiceInterface>(UserStatusModule.UserStatusServiceInterface).to(UserStatusService);
  kernel.bind(UserStatusModule.UserStatusResetCronJob).to(UserStatusResetCronJob);
}
