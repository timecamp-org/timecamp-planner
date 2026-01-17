import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { PasswordModule } from './PasswordModule';
import { PasswordService } from './PasswordService';
import { PasswordServiceInterface } from './PasswordServiceInterface';

export const passwordModule : ModuleLoaderType = kernel => {
  kernel.bind<PasswordServiceInterface>(PasswordModule.PasswordServiceInterface).to(PasswordService);
}
