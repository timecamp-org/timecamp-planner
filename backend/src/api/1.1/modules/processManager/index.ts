import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { ProcessManagerModule } from './ProcessManagerModule'
import * as PM2 from 'pm2'
import { RestServerPluginInterface } from '../../../../infrastructure/restServer/RestServerPluginInterface';
import { RestServerModule } from '../../../../infrastructure/restServer/RestServerModule';
import { ProcessManagerPlugin } from './ProcessManagerPlugin';
import processManagerConfig from '../../../../config/process.config';
import { ProcessManagerConfig } from './types';
import { Pm2Provider } from './Pm2Provider';
import { Pm2ProviderInterface } from './interfaces/Pm2ProviderInterface';
import { ProcessCommunicationInterface } from './interfaces/ProcessCommunicationInterface';
import { ProcessCommunication } from './ProcessCommunication';
import { ProcessManagerInterface } from './interfaces/ProcessManagerInterface';
import { ProcessManager } from './ProcessManager';

export const processManagerModule: ModuleLoaderType = kernel => {
  kernel.bind(ProcessManagerModule.ProcessManagerInstance).toConstantValue(PM2);
  kernel.bind<Pm2ProviderInterface>(ProcessManagerModule.ProcessManagerProvider).to(Pm2Provider)
  kernel.bind(ProcessManagerModule.ProcessManagerPlugin).to(ProcessManagerPlugin);
  kernel.bind<ProcessManagerConfig>(ProcessManagerModule.ProcessManagerConfig).toConstantValue(processManagerConfig);

  kernel.bind<ProcessCommunicationInterface>(ProcessManagerModule.ProcessCommunicationInterface).to(ProcessCommunication);
  kernel.bind<ProcessManagerInterface>(ProcessManagerModule.ProcessManagerInterface).to(ProcessManager);

  kernel.bind<RestServerPluginInterface>(RestServerModule.RestServerPlugin)
    .toService(ProcessManagerModule.ProcessManagerPlugin);
}
