import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { TokenModule } from './TokenModule';
import { TokenServiceInterface } from './TokenServiceInterface';
import { TokenService } from './TokenService';

export const tokenModule : ModuleLoaderType = kernel => {
  kernel.bind<TokenServiceInterface>(TokenModule.TokenServiceInterface).to(TokenService);
}
