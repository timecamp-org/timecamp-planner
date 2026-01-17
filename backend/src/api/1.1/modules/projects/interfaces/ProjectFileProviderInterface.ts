import { Id } from '../../common/identifier';
import { FileDbRow, ProjectFileDbRow } from '../../db/schema';

export interface ProjectFileProviderInterface {
  createProjectFile(projectFile: ProjectFileDbRow): PromiseLike<FileDbRow>;
  deleteProjectFile(fileId: Id): Promise<void>;
}
