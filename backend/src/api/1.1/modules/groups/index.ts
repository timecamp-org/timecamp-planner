import { ModuleLoaderType } from '../../../../ModuleLoaderType';

import { OrganizationGroupsServiceInterface } from '../groups/interfaces/OrganizationGroupsServiceInterface';
import { OrganizationGroupsService } from '../groups/OrganizationGroupsService';
import { OrganizationGroupsProviderInterface } from './interfaces/OrganizationGroupsProviderInterface';
import { OrganizationGroupsProvider } from '../groups/dataProviders/OrganizationGroupsProvider';
import { GroupsModule } from './GroupsModule';
import { UserInGroupProviderInterface } from './interfaces/UserInGroupProviderInterface';
import { UserInGroupProvider } from './dataProviders/UserInGroupProvider';

export const groupsModule: ModuleLoaderType = (kernel) => {
  kernel
    .bind<OrganizationGroupsServiceInterface>(
      GroupsModule.OrganizationGroupsServiceInterface
    )
    .to(OrganizationGroupsService);
  kernel
    .bind<OrganizationGroupsProviderInterface>(
      GroupsModule.OrganizationGroupsProviderInterface
    )
    .to(OrganizationGroupsProvider);
  kernel
    .bind<UserInGroupProviderInterface>(
      GroupsModule.UserInGroupProviderInterface
    )
    .to(UserInGroupProvider);
};
