import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { OrganizationsModule } from './OrganizationsModule';
import { OrganizationService } from './OrganizationService';
import { OrganizationServiceInterface } from './interfaces/OrganizationServiceInterface';
import { WorkspaceService } from './WorkspaceService';
import { InvitationServiceInterface } from './interfaces/InvitationServiceInterface';
import { InvitationService } from './InvitationService';
import { WorkspaceServiceInterface } from './interfaces/WorkspaceServiceInterface';
import { UserInOrganizationProvider } from './dataProviders/UserInOrganizationProvider';
import { UserInOrganizationProviderInterface } from './interfaces/UserInOrganizationProviderInterface';
import { UserInvitationProvider } from './dataProviders/UserInvitationProvider';
import { UserInvitationProviderInterface } from './interfaces/UserInvitationProviderInterface';
import { InvitationEmailReminderCronJob } from './InvitationEmailReminderCronJob';
import { CronTabJobInterface } from '../cron/CronTabJobInterface';
import { UserInOrganizationServiceInterface } from './interfaces/UserInOrganizationServiceInterface';
import { UserInOrganizationService } from './UserInOrganizationService';
import { OrganizationProvider } from './dataProviders/OrganizationProvider';
import { OrganizationProviderInterface } from './interfaces/OrganizationProviderInterface';
import { OrganizationPermissions } from './OrganizationPermissions';
import { EntityPermissionInterface } from '../permissions/interfaces/EntityPermissionInterface';
import { PermissionsModule } from '../permissions/PermissionsModule';
import { OrganizationProjectsProviderInterface } from './interfaces/OrganizationProjectsProviderInterface'
import { OrganizationProjectsProvider } from './dataProviders/OrganizationProjectsProvider'
import { OrganizationProjectsResource } from './resources/OrganizationProjectsResource'
import { ResourceInterface } from '../../../../infrastructure/resources/ResourceInterface'
import {
  OrganizationPeopleResourceContext, OrganizationPeopleResourceData, OrganizationPeopleResourceQueryParams,
  OrganizationProjectsQueryParams,
  OrganizationProjectsResourceContext,
  OrganizationProjectsResourceData,
} from './types'
import { OrganizationProjectsServiceInterface } from './interfaces/OrganizationProjectsServiceInterface'
import { OrganizationProjectsService } from './OrganizationProjectsService'
import { OrganizationPeopleResource } from './resources/OrganizationPeopleResource';

export const organizationsModule: ModuleLoaderType = kernel => {
  kernel.bind<OrganizationServiceInterface>(OrganizationsModule.OrganizationServiceInterface).to(OrganizationService).inSingletonScope();
  kernel.bind<OrganizationProjectsProviderInterface>(OrganizationsModule.OrganizationProjectsProviderInterface).to(OrganizationProjectsProvider);
  kernel.bind<OrganizationProjectsServiceInterface>(OrganizationsModule.OrganizationProjectsServiceInterface).to(OrganizationProjectsService);
  kernel.bind<OrganizationProviderInterface>(OrganizationsModule.OrganizationProviderInterface).to(OrganizationProvider);
  kernel.bind<WorkspaceServiceInterface>(OrganizationsModule.WorkspaceServiceInterface).to(WorkspaceService);
  kernel.bind<InvitationServiceInterface>(OrganizationsModule.InvitationServiceInterface).to(InvitationService);
  kernel.bind<UserInOrganizationProviderInterface>(OrganizationsModule.UserInOrganizationProviderInterface).to(UserInOrganizationProvider);
  kernel.bind<UserInvitationProviderInterface>(OrganizationsModule.UserInvitationProviderInterface).to(UserInvitationProvider);
  kernel.bind<CronTabJobInterface>(OrganizationsModule.InvitationEmailReminderCronJob).to(InvitationEmailReminderCronJob);

  kernel.bind<UserInOrganizationServiceInterface>(OrganizationsModule.UserInOrganizationServiceInterface).to(UserInOrganizationService);

  kernel.bind<EntityPermissionInterface>(PermissionsModule.EntityPermissionInterface)
    .to(OrganizationPermissions)

  kernel.bind<ResourceInterface<OrganizationProjectsQueryParams, OrganizationProjectsResourceContext, OrganizationProjectsResourceData>>(OrganizationsModule.OrganizationProjectsResource)
    .to(OrganizationProjectsResource)
  kernel.bind<ResourceInterface<OrganizationPeopleResourceQueryParams, OrganizationPeopleResourceContext, OrganizationPeopleResourceData>>(OrganizationsModule.OrganizationPeopleResource)
    .to(OrganizationPeopleResource)
}
