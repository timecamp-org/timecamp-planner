import { ModuleLoaderType } from '../../../../ModuleLoaderType';
import { SearchModule } from './SearchModule';
import { SearchService } from './SearchService';
import { SearchServiceInterface } from './interfaces/SearchServiceInterface';

export const searchModule: ModuleLoaderType = (kernel) => {
  kernel.bind<SearchServiceInterface>(SearchModule.SearchServiceInterface).to(SearchService);
};
