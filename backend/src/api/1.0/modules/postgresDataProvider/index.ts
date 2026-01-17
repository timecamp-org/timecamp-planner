import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { TaskProviderInterface } from '../tasks/interfaces/TaskProviderInterface'
import { TasksModule } from '../tasks/TasksModule'
import { PostgresTaskProvider } from './PostgresTaskProvider'
import { NotificationProviderInterface } from '../notifications/interfaces/NotificationProviderInterface'
import { NotificationsModule } from '../notifications/NotificationsModule'
import { PostgresNotificationProvider } from './PostgresNotificationProvider'
import { UserProviderInterface } from '../users/UserProviderInterface'
import { UsersModule } from '../users/UsersModule'
import { PostgresUserProvider } from './PostgresUserProvider'

export const postgresDataProvider : ModuleLoaderType = (kernel, config) => {
  kernel.bind<TaskProviderInterface>(TasksModule.TaskProviderInterface)
    .to(PostgresTaskProvider)
  ;
  
  kernel.bind<NotificationProviderInterface>(NotificationsModule.NotificationProviderInterface)
    .to(PostgresNotificationProvider)
  ;
  
  kernel
    .bind<UserProviderInterface>(UsersModule.UserProviderInterface)
    .to(PostgresUserProvider)
  ;
}
