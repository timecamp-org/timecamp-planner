import { interfaces } from 'inversify';
import { ModuleLoaderType } from '../../../../ModuleLoaderType';
import config from '../../../../config';
import { ResourceInterface } from '../../../../infrastructure/resources/ResourceInterface';
import { ColorGenerator, ColorGeneratorInterface } from '../common/ColorGenerator';
import { ConnectionInterface } from '../db/ConnectionInterface';
import { DbModule } from '../db/DbModule';
import Table from '../db/Table';
import { DictProvider } from '../dict/DictProvider';
import { DictProviderInterface } from '../dict/interfaces/DictProviderInterface';
import { MessageQueueModule } from '../messageQueue/MessageQueueModule';
import { QueueDescriptor } from '../messageQueue/QueueDescriptor';
import { WorkerOptionsInterface } from '../messageQueue/types';
import { PermissionsModule } from '../permissions/PermissionsModule';
import { EntityPermissionInterface } from '../permissions/interfaces/EntityPermissionInterface';
import { ProjectTasksQueryParams } from '../tasks/types';
import { ConversationService } from './ConversationService';
import { GuestInProjectService } from './GuestInProjectService';
import { ProjectFollowersService } from './ProjectFollowersService';
import { ProjectPeopleService } from './ProjectPeopleService';
import { ProjectPermissions } from './ProjectPermissions';
import { ProjectService } from './ProjectService';
import { ProjectTasksService } from './ProjectTasksService';
import { ProjectsJobFactory } from './ProjectsJobFactory';
import { ProjectsModule } from './ProjectsModule';
import { ConversationServiceInterface } from './interfaces/ConversationServiceInterface';
import { ConversationSettingsProviderInterface } from './interfaces/ConversationSettingsProviderInterface';
import { GuestInProjectProviderInterface } from './interfaces/GuestInProjectProviderInterface';
import { GuestInProjectServiceInterface } from './interfaces/GuestInProjectServiceInterface';
import { ProjectFileProviderInterface } from './interfaces/ProjectFileProviderInterface';
import { ProjectFollowersServiceInterface } from './interfaces/ProjectFollowersServiceInterface';
import { ProjectLatestVisitProviderInterface } from './interfaces/ProjectLatestVisitProviderInterface';
import { ProjectPeopleServiceInterface } from './interfaces/ProjectPeopleServiceInterface';
import { ProjectProviderInterface } from './interfaces/ProjectProviderInterface';
import { ProjectServiceInterface } from './interfaces/ProjectServiceInterface';
import { ProjectSettingsProviderInterface } from './interfaces/ProjectSettingsProviderInterface';
import { ProjectTasksProviderInterface } from './interfaces/ProjectTasksProviderInterface';
import { ProjectTasksServiceInterface } from './interfaces/ProjectTasksServiceInterface';
import { ProjectsJobFactoryInterface } from './interfaces/ProjectsJobFactoryInterface';
import { UserInProjectProviderInterface } from './interfaces/UserInProjectProviderInterface';
import { ConversationSettingsProvider } from './providers/ConversationSettingsProvider';
import { GuestInProjectProvider } from './providers/GuestInProjectProvider';
import { ProjectLatestVisitProvider } from './providers/ProjectLatestVisitProvider';
import { ProjectProvider } from './providers/ProjectProvider';
import { ProjectSettingsProvider } from './providers/ProjectSettingsProvider';
import { ProjectTasksProvider } from './providers/ProjectTasksProvider';
import { UserInProjectProvider } from './providers/UserInProjectProvider';
import { ProjectResource } from './resources/ProjectResource';
import { ProjectTasksResource } from './resources/ProjectTasksResource';
import {
  ProjectIconType,
  ProjectQueryParams,
  ProjectResourceContext,
  ProjectResourceData,
  ProjectTasksResourceContext,
  ProjectTasksResourceData,
  ProjectsQueueType,
} from './types';
import { ProjectsWorker } from './workers/ProjectsWorker';
import { ProjectFileProvider } from './providers/ProjectFileProvider';

export const projectsModule: ModuleLoaderType = (kernel) => {
  kernel.bind<ProjectServiceInterface>(ProjectsModule.ProjectServiceInterface).to(ProjectService);
  kernel.bind<UserInProjectProviderInterface>(ProjectsModule.UserInProjectProviderInterface).to(UserInProjectProvider);
  kernel
    .bind<ColorGeneratorInterface>(ProjectsModule.ProjectColorGeneratorInterface)
    .toDynamicValue((context) => new ColorGenerator(config.colors.projects));
  kernel
    .bind<ProjectSettingsProviderInterface>(ProjectsModule.ProjectSettingsProviderInterface)
    .to(ProjectSettingsProvider);
  kernel
    .bind<ProjectFollowersServiceInterface>(ProjectsModule.ProjectFollowersServiceInterface)
    .to(ProjectFollowersService);
  kernel.bind<ProjectPeopleServiceInterface>(ProjectsModule.ProjectPeopleServiceInterface).to(ProjectPeopleService);
  kernel.bind<ProjectTasksServiceInterface>(ProjectsModule.ProjectTasksServiceInterface).to(ProjectTasksService);
  kernel.bind<ProjectProviderInterface>(ProjectsModule.ProjectProviderInterface).to(ProjectProvider);
  kernel.bind<ProjectTasksProviderInterface>(ProjectsModule.ProjectTasksProviderInterface).to(ProjectTasksProvider);
  kernel.bind<ConversationServiceInterface>(ProjectsModule.ConversationServiceInterface).to(ConversationService);
  kernel
    .bind<ConversationSettingsProviderInterface>(ProjectsModule.ConversationSettingsProviderInterface)
    .to(ConversationSettingsProvider);

  kernel
    .bind<ResourceInterface<ProjectTasksQueryParams, ProjectTasksResourceContext, ProjectTasksResourceData>>(
      ProjectsModule.ProjectTasksResource
    )
    .to(ProjectTasksResource);

  kernel
    .bind<ResourceInterface<ProjectQueryParams, ProjectResourceContext, ProjectResourceData>>(
      ProjectsModule.ProjectResource
    )
    .to(ProjectResource);

  kernel.bind<EntityPermissionInterface>(PermissionsModule.EntityPermissionInterface).to(ProjectPermissions);

  kernel
    .bind<GuestInProjectProviderInterface>(ProjectsModule.GuestInProjectProviderInterface)
    .to(GuestInProjectProvider);

  kernel.bind<GuestInProjectServiceInterface>(ProjectsModule.GuestInProjectServiceInterface).to(GuestInProjectService);

  kernel.bind<ProjectsJobFactoryInterface>(ProjectsModule.ProjectsJobFactoryInterface).to(ProjectsJobFactory);
  kernel.bind(ProjectsModule.ProjectsWorker).to(ProjectsWorker);
  kernel
    .bind(ProjectsModule.ProjectsQueue)
    .toDynamicValue(() => new QueueDescriptor(ProjectsQueueType.PROJECTS, { durable: true }));
  kernel
    .bind<WorkerOptionsInterface>(MessageQueueModule.WorkerOptionsInterface)
    .toConstantValue({ maxConcurrentJobs: 5 })
    .whenTargetNamed('ProjectsWorker');

  kernel
    .bind<ProjectLatestVisitProviderInterface>(ProjectsModule.LastViewedProjectProvider)
    .to(ProjectLatestVisitProvider);
  kernel
    .bind<DictProviderInterface<ProjectIconType>>(ProjectsModule.DictProjectIconType)
    .toDynamicValue((ctx: interfaces.Context) => {
      const connection = ctx.container.get<ConnectionInterface>(DbModule.ConnectionInterface);
      return new DictProvider(connection, Table.DICT_PROJECT_ICON_TYPE);
    });
  kernel.bind<ProjectFileProviderInterface>(ProjectsModule.ProjectFileProviderInterface).to(ProjectFileProvider);
};
