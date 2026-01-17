import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { TagsModule } from './TagsModule';
import { TagServiceInterface } from './TagServiceInterface';
import TagService from './TagService';
import { ColorGenerator, ColorGeneratorInterface } from '../common/ColorGenerator';
import config from '../../../../config';
import { EntityPermissionInterface } from '../permissions/interfaces/EntityPermissionInterface';
import { PermissionsModule } from '../permissions/PermissionsModule';
import { TagPermissions } from './TagPermissions';

export const tagsModule : ModuleLoaderType = kernel => {
  kernel.bind<TagServiceInterface>(TagsModule.TagServiceInterface).to(TagService);
  kernel.bind<ColorGeneratorInterface>(TagsModule.TagColorGeneratorInterface).toDynamicValue((context) => new ColorGenerator(config.colors.tags));
  kernel.bind<EntityPermissionInterface>(PermissionsModule.EntityPermissionInterface).to(TagPermissions)
}
