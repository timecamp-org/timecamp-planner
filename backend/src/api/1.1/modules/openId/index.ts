import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { OpenIdModule } from './OpenIdModule';
import { OpenIdProviderInterface } from './interfaces/OpenIdProviderInterface';
import { OpenIdConnect } from './OpenIdConnect';
import { OpenIdProviderFactoryInterface } from './interfaces/OpenIdProviderFactoryInterface';
import { OpenIdProviderFactory } from './OpenIdProviderFactory';
import { OpenIdServiceInterface } from './OpenIdServiceInterface';
import { OpenIdService } from './OpenIdService';

export const openIdModule : ModuleLoaderType = kernel => {
  kernel.bind<OpenIdServiceInterface>(OpenIdModule.OpenIdServiceInterface).to(OpenIdService);
  kernel.bind<OpenIdProviderInterface>(OpenIdModule.OpenIdProviderInterface).to(OpenIdConnect);
  kernel.bind<OpenIdProviderFactoryInterface>(OpenIdModule.OpenIdProviderFactoryInterface).to(OpenIdProviderFactory);
}
