import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { ProjectPersonalStructureModule } from './ProjectPersonalStructureModule';
import { PersonalProjectOrderServiceInterface } from './interfaces/PersonalProjectOrderServiceInterface';
import { PersonalProjectOrderService } from './PersonalProjectOrderService';
import { PersonalProjectOrderProvider } from "./providers/PersonalProjectOrderProvider";
import { PersonalProjectOrderProviderInterface } from "./interfaces/PersonalProjectOrderProviderInterface";
import { PersonalProjectGroupService } from "./PersonalProjectGroupService";
import { PersonalProjectGroupProvider } from "./providers/PersonalProjectGroupProvider";
import { PersonalProjectGroupServiceInterface } from "./interfaces/PersonalProjectGroupServiceInterface";
import { PersonalProjectGroupProviderInterface } from "./interfaces/PersonalProjectGroupProviderInterface";
import { ProjectInGroupProviderInterface } from "./interfaces/ProjectInGroupProviderInterface";
import { ProjectInGroupProvider } from "./providers/ProjectInGroupProvider";
import { ProjectPersonalStructurePermissions } from "./ProjectPersonalStructurePermissions";
import { EntityPermissionInterface } from "../permissions/interfaces/EntityPermissionInterface";
import { ProjectPersonalStructureResource } from "./resources/ProjectPersonalStructureResource";
import { PermissionsModule } from "../permissions/PermissionsModule";
import { ProjectsSubWorkerInterface } from "../projects/interfaces/ProjectsSubWorkerInterface";
import { ProjectsModule } from "../projects/ProjectsModule";
import { DetermineOrderForUnarchivedSpaceWorker } from "./workers/DetermineOrderForUnarchivedSpaceWorker";

export const personalProjectOrderModule : ModuleLoaderType = kernel => {
  kernel.bind<PersonalProjectOrderServiceInterface>(ProjectPersonalStructureModule.PersonalProjectOrderServiceInterface).to(PersonalProjectOrderService)
  kernel.bind<PersonalProjectOrderProviderInterface>(ProjectPersonalStructureModule.PersonalProjectOrderProviderInterface).to(PersonalProjectOrderProvider)
  kernel.bind<PersonalProjectGroupServiceInterface>(ProjectPersonalStructureModule.PersonalProjectGroupServiceInterface).to(PersonalProjectGroupService)
  kernel.bind<PersonalProjectGroupProviderInterface>(ProjectPersonalStructureModule.PersonalProjectGroupProviderInterface).to(PersonalProjectGroupProvider)
  kernel.bind<ProjectInGroupProviderInterface>(ProjectPersonalStructureModule.ProjectInGroupProviderInterface).to(ProjectInGroupProvider)
  kernel.bind<ProjectPersonalStructureResource>(ProjectPersonalStructureModule.ProjectPersonalStructureResource).to(ProjectPersonalStructureResource)

  kernel.bind<EntityPermissionInterface>(PermissionsModule.EntityPermissionInterface).to(ProjectPersonalStructurePermissions)
  kernel.bind<ProjectsSubWorkerInterface>(ProjectsModule.ProjectsSubWorker)
    .to(DetermineOrderForUnarchivedSpaceWorker)
}
