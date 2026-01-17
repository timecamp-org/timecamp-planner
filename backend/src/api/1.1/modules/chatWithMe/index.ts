import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { ChatWithMeServiceInterface } from './interfaces/ChatWithMeServiceInterface';
import { ChatWithMeService } from './ChatWithMeService';
import { ChatWithMeModule } from './ChatWithMeModule';
import { ChatWithMeCustomFieldsProvider } from './ChatWithMeCustomFieldsProvider';
import { ChatWithMeCustomFieldsProviderInterface } from './interfaces/ChatWithMeCustomFieldsProviderInterface';

export const chatWithMeModule: ModuleLoaderType = kernel =>
{
  kernel.bind<ChatWithMeServiceInterface>(ChatWithMeModule.ChatWithMeServiceInterface)
    .to(ChatWithMeService);
  kernel.bind<ChatWithMeCustomFieldsProviderInterface>(ChatWithMeModule.ChatWithMeCustomFieldsProviderInterface)
    .to(ChatWithMeCustomFieldsProvider);
}
