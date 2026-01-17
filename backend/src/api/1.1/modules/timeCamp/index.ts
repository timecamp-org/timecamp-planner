import { ModuleLoaderType } from '../../../../ModuleLoaderType';
import { TimeCampApi } from './TimeCampApi';
import { TimeCampModule } from './TimeCampModule';
import { TimeCampService } from './TimeCampService';
import { TimeCampApiInterface } from './interfaces/TimeCampApiInterface';
import { TimeCampServiceInterface } from './interfaces/TimeCampServiceInterface';

export const timeCampModule: ModuleLoaderType = (kernel) => {
  kernel.bind<TimeCampServiceInterface>(TimeCampModule.TimeCampServiceInterface).to(TimeCampService);
  kernel.bind<TimeCampApiInterface>(TimeCampModule.TimeCampApiInterface).to(TimeCampApi);
};
