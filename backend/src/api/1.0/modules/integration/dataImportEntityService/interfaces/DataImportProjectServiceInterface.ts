import { Id } from '../../../common/identifier';
import { ProjectDbRow } from '../../../db/schema';


export interface DataImportProjectServiceInterface {

  createProjects(
    extensionId: Id,
    organizationId: Id,
    userId: Id,
    externalProjects: Partial<ProjectDbRow>[],
    trx: Transaction,
  ): Promise<ProjectDbRow[]>

}
