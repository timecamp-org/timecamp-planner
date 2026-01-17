import { ModuleLoaderType } from '../../../../ModuleLoaderType';
import { TaskServiceInterface } from './interfaces/TaskServiceInterface';
import { TasksModule } from './TasksModule';
import { TaskService } from './TaskService';
import { RecurringTasksCronJob } from './RecurringTasksCronJob';
import { EntityPermissionInterface } from '../permissions/interfaces/EntityPermissionInterface';
import { PermissionsModule } from '../permissions/PermissionsModule';
import { TaskPermissions } from './TaskPermissions';
import { TaskAttachmentProviderInterface } from './interfaces/TaskAttachmentProviderInterface';
import { TaskAttachmentProvider } from './providers/TaskAttachmentProvider';
import { UserInTaskProviderInterface } from './interfaces/UserInTaskProviderInterface';
import { UserInTaskProvider } from './providers/UserInTaskProvider';
import { UserFollowingTaskProviderInterface } from './interfaces/UserFollowingTaskProviderInterface';
import { UserFollowingTaskProvider } from './providers/UserFollowingTaskProvider';
import { TaskTimeEstimatesProviderInterface } from './interfaces/TaskTimeEstimatesProviderInterface';
import { TaskTimeEstimatesProvider } from './providers/TaskTimeEstimatesProvider';

export const tasksModule: ModuleLoaderType = (kernel) => {
  kernel.bind<TaskServiceInterface>(TasksModule.TaskServiceInterface).to(TaskService).inSingletonScope();
  kernel.bind<TaskAttachmentProviderInterface>(TasksModule.TaskAttachmentProviderInterface).to(TaskAttachmentProvider);
  kernel.bind<RecurringTasksCronJob>(TasksModule.RecurringTasksCronJob).to(RecurringTasksCronJob);

  kernel.bind<EntityPermissionInterface>(PermissionsModule.EntityPermissionInterface).to(TaskPermissions);
  kernel.bind<UserInTaskProviderInterface>(TasksModule.UserInTaskProviderInterface).to(UserInTaskProvider);
  kernel
    .bind<UserFollowingTaskProviderInterface>(TasksModule.UserFollowingTaskProviderInterface)
    .to(UserFollowingTaskProvider);
  kernel
    .bind<TaskTimeEstimatesProviderInterface>(TasksModule.TaskTimeEstimatesProviderInterface)
    .to(TaskTimeEstimatesProvider);
};
