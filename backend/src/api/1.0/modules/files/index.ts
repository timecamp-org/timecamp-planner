import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { FilesModule } from './FilesModule';
import { FileService } from './FileService';
import { FileServiceInterface } from './interfaces/FileServiceInterface';
import { FileServiceOptions } from './types';
import { FileProviderInterface } from './interfaces/FileProviderInterface'
import { FileProvider } from './dataProviders/FileProvider'
import { EntityPermissionInterface } from '../permissions/interfaces/EntityPermissionInterface';
import { PermissionsModule } from '../permissions/PermissionsModule';
import { FilePermissions } from './FilePermissions';
import { AttachmentService } from './AttachmentService';
import { AttachmentServiceInterface } from './interfaces/AttachmentServiceInterface';

export const filesModule : ModuleLoaderType = kernel => {
  kernel.bind<FileServiceInterface>(FilesModule.FileServiceInterface).to(FileService);
  kernel.bind<FileServiceOptions>(FilesModule.FileServiceOptions).toConstantValue({
    debugMode: false,
  })
  kernel.bind<FileProviderInterface>(FilesModule.FileProviderInterface).to(FileProvider)
  kernel.bind<EntityPermissionInterface>(PermissionsModule.EntityPermissionInterface).to(FilePermissions)
  kernel.bind<AttachmentServiceInterface>(FilesModule.AttachmentServiceInterface).to(AttachmentService)
}
