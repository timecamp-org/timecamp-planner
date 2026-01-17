import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { UsersModule } from './UsersModule';
import UserService from './UserService';
import { UserServiceInterface } from './UserServiceInterface';
import { CommandConfig } from '../console/types';
import { ConsoleModule } from '../console/ConsoleModule';
import { ConsoleCommandInterface } from '../console/ConsoleCommandInterface';
import { GenerateResetPasswordLinkCommand } from './GenerateResetPasswordLinkCommand';
import { EntityPermissionInterface } from '../permissions/interfaces/EntityPermissionInterface';
import { PermissionsModule } from '../permissions/PermissionsModule';
import { UserPermissions } from './UserPermissions';

export const usersModule: ModuleLoaderType = kernel => {
  kernel.bind<UserServiceInterface>(UsersModule.UserServiceInterface).to(UserService);
  kernel.bind<CommandConfig>(ConsoleModule.ConsoleCommand).toConstantValue({
    name: 'users:reset-password-link',
    description: 'Generate reset password link for user email',
    serviceId: UsersModule.GenerateResetPasswordLinkCommand,
  });
  kernel.bind<ConsoleCommandInterface>(UsersModule.GenerateResetPasswordLinkCommand)
    .to(GenerateResetPasswordLinkCommand);
  kernel.bind<EntityPermissionInterface>(PermissionsModule.EntityPermissionInterface)
    .to(UserPermissions)
}
