import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { BotModule } from './BotModule';
import { BotService } from './BotService';
import { BotServiceInterface } from './BotServiceInterface';
import { OnboardingMessageSender } from './OnboardingMessageSender';
import { BotProviderInterface } from './BotProviderInterface'
import { BotProvider } from './BotProvider'
import { RestServerModule } from '../../../../infrastructure/restServer/RestServerModule'
import { BotModuleServerPlugin } from './BotModuleServerPlugin'

export const botModule : ModuleLoaderType = kernel => {
  kernel.bind<BotServiceInterface>(BotModule.BotServiceInterface).to(BotService);
  kernel.bind<BotProviderInterface>(BotModule.BotProviderInterface).to(BotProvider);
  kernel.bind(BotModule.OnboardingMessageSender).to(OnboardingMessageSender);
  kernel.bind(BotModule.BotServiceConfig).toConstantValue({});
  kernel.bind(BotModule.OnboardingMessageSenderOptions).toConstantValue({});
  
  kernel.bind(RestServerModule.RestServerPlugin)
    .to(BotModuleServerPlugin);
}
