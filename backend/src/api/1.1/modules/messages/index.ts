import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { MessagesModule } from './MessagesModule';
import { MessageService } from './MessageService';
import { MessageServiceInterface } from './interfaces/MessageServiceInterface';
import { MessageContainerServiceInterface } from './interfaces/MessageContainerServiceInterface';
import { MessageContainerService } from './MessageContainerService';
import { EntityPermissionInterface } from '../permissions/interfaces/EntityPermissionInterface';
import { PermissionsModule } from '../permissions/PermissionsModule';
import { MessagePermissions } from './MessagePermissions';
import { MessageAttachmentProviderInterface } from './interfaces/MessageAttachmentProviderInterface';
import { MessageAttachmentProvider } from './providers/MessageAttachmentProvider';

export const messagesModule : ModuleLoaderType = kernel => {
  // dbNamingConverter
  kernel.bind<MessageServiceInterface>(MessagesModule.MessageServiceInterface).to(MessageService);
  kernel.bind<MessageAttachmentProviderInterface>(MessagesModule.MessageAttachmentProviderInterface).to(MessageAttachmentProvider);
  kernel.bind<MessageContainerServiceInterface>(MessagesModule.MessageContainerServiceInterface).to(MessageContainerService);
  kernel.bind<EntityPermissionInterface>(PermissionsModule.EntityPermissionInterface).to(MessagePermissions);
}
