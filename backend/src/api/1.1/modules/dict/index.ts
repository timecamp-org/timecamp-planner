import { ModuleLoaderType } from '../../../../ModuleLoaderType';
import { DictModule } from './DictModule';
import { DictService } from './DictService';
import { DictServiceInterface } from './interfaces/DictServiceInterface';

export const dictModule: ModuleLoaderType = (kernel) => {
  kernel.bind<DictServiceInterface>(DictModule.DictServiceInterface).to(DictService);
};
