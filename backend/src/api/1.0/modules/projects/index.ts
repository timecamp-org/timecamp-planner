import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { ProjectsModule } from './ProjectsModule'
import { ProjectServiceInterface } from './interfaces/ProjectServiceInterface';
import { ProjectService } from './ProjectService';
import { ColorGenerator, ColorGeneratorInterface } from '../common/ColorGenerator';
import config from '../../../../config';
import { UserInProjectProvider } from './providers/UserInProjectProvider';
import { UserInProjectProviderInterface } from './interfaces/UserInProjectProviderInterface';
import { ProjectSettingsProviderInterface } from './interfaces/ProjectSettingsProviderInterface'
import { ProjectSettingsProvider } from './providers/ProjectSettingsProvider'
import { ProjectFollowersService } from './ProjectFollowersService';
import { ProjectFollowersServiceInterface } from './interfaces/ProjectFollowersServiceInterface';
import { ProjectPeopleService } from './ProjectPeopleService';
import { ProjectPeopleServiceInterface } from './interfaces/ProjectPeopleServiceInterface';
import { ProjectTasksService } from './ProjectTasksService';
import { ProjectTasksServiceInterface } from './interfaces/ProjectTasksServiceInterface';
import { ProjectProvider } from './providers/ProjectProvider';
import { ProjectProviderInterface } from './interfaces/ProjectProviderInterface';
import { PermissionsModule } from '../permissions/PermissionsModule';
import { EntityPermissionInterface } from '../permissions/interfaces/EntityPermissionInterface';
import { ProjectPermissions } from './ProjectPermissions';
import { ProjectTasksProviderInterface } from './interfaces/ProjectTasksProviderInterface';
import { ProjectTasksProvider } from './providers/ProjectTasksProvider';
import { ProjectTasksResource } from './resources/ProjectTasksResource';
import { ResourceInterface } from '../../../../infrastructure/resources/ResourceInterface';
import {
  ProjectTasksResourceContext,
  ProjectTasksResourceData,
  ProjectQueryParams,
  ProjectResourceContext,
  ProjectResourceData, ProjectsQueueType
} from './types';
import { ConversationServiceInterface } from './interfaces/ConversationServiceInterface';
import { ConversationService } from './ConversationService';
import { ProjectTasksQueryParams } from '../tasks/types';
import { ProjectResource } from './resources/ProjectResource';
import { ConversationSettingsProviderInterface } from './interfaces/ConversationSettingsProviderInterface';
import { ConversationSettingsProvider } from './providers/ConversationSettingsProvider'
import { GuestInProjectProviderInterface } from './interfaces/GuestInProjectProviderInterface'
import { GuestInProjectProvider } from './providers/GuestInProjectProvider'
import { GuestInProjectServiceInterface } from './interfaces/GuestInProjectServiceInterface'
import { GuestInProjectService } from './GuestInProjectService'
import { ProjectsJobFactoryInterface } from "./interfaces/ProjectsJobFactoryInterface";
import { ProjectsJobFactory } from "./ProjectsJobFactory";
import { QueueDescriptor } from "../messageQueue/QueueDescriptor";
import { WorkerOptionsInterface } from "../messageQueue/types";
import { MessageQueueModule } from "../messageQueue/MessageQueueModule";
import { ProjectsWorker } from "./workers/ProjectsWorker";
import { ProjectLatestVisitProvider } from "./providers/ProjectLatestVisitProvider";
import { ProjectLatestVisitProviderInterface } from "./interfaces/ProjectLatestVisitProviderInterface";

export const projectsModule: ModuleLoaderType = kernel => {
  kernel.bind<ProjectServiceInterface>(ProjectsModule.ProjectServiceInterface).to(ProjectService)
  kernel.bind<UserInProjectProviderInterface>(ProjectsModule.UserInProjectProviderInterface).to(UserInProjectProvider)
  kernel.bind<ColorGeneratorInterface>(ProjectsModule.ProjectColorGeneratorInterface).toDynamicValue((context) => new ColorGenerator(config.colors.projects));
  kernel.bind<ProjectSettingsProviderInterface>(ProjectsModule.ProjectSettingsProviderInterface).to(ProjectSettingsProvider)
  kernel.bind<ProjectFollowersServiceInterface>(ProjectsModule.ProjectFollowersServiceInterface).to(ProjectFollowersService)
  kernel.bind<ProjectPeopleServiceInterface>(ProjectsModule.ProjectPeopleServiceInterface).to(ProjectPeopleService)
  kernel.bind<ProjectTasksServiceInterface>(ProjectsModule.ProjectTasksServiceInterface).to(ProjectTasksService)
  kernel.bind<ProjectProviderInterface>(ProjectsModule.ProjectProviderInterface).to(ProjectProvider)
  kernel.bind<ProjectTasksProviderInterface>(ProjectsModule.ProjectTasksProviderInterface).to(ProjectTasksProvider)
  kernel.bind<ConversationServiceInterface>(ProjectsModule.ConversationServiceInterface).to(ConversationService)
  kernel.bind<ConversationSettingsProviderInterface>(ProjectsModule.ConversationSettingsProviderInterface).to(ConversationSettingsProvider)

  kernel
    .bind<ResourceInterface<ProjectTasksQueryParams, ProjectTasksResourceContext, ProjectTasksResourceData>>(ProjectsModule.ProjectTasksResource)
    .to(ProjectTasksResource)

  kernel
    .bind<ResourceInterface<ProjectQueryParams, ProjectResourceContext, ProjectResourceData>>(ProjectsModule.ProjectResource)
    .to(ProjectResource)

  kernel.bind<EntityPermissionInterface>(PermissionsModule.EntityPermissionInterface)
    .to(ProjectPermissions)

  kernel.bind<GuestInProjectProviderInterface>(ProjectsModule.GuestInProjectProviderInterface)
    .to(GuestInProjectProvider)

  kernel.bind<GuestInProjectServiceInterface>(ProjectsModule.GuestInProjectServiceInterface)
    .to(GuestInProjectService)

  kernel.bind<ProjectsJobFactoryInterface>(ProjectsModule.ProjectsJobFactoryInterface).to(ProjectsJobFactory)
  kernel.bind(ProjectsModule.ProjectsWorker).to(ProjectsWorker)
  kernel
    .bind(ProjectsModule.ProjectsQueue)
    .toDynamicValue(() => new QueueDescriptor(ProjectsQueueType.PROJECTS, { durable: true }))
  kernel
    .bind<WorkerOptionsInterface>(MessageQueueModule.WorkerOptionsInterface)
    .toConstantValue({ maxConcurrentJobs: 5 })
    .whenTargetNamed('ProjectsWorker')

  kernel.bind<ProjectLatestVisitProviderInterface>(ProjectsModule.LastViewedProjectProvider).to(ProjectLatestVisitProvider)

}
