import { ProjectDbRow } from '../../../db/schema';

import { Id } from '../../../common/identifier';
import { UserInProjectJson } from '../../../projects/types';

export interface DataImportUserInProjectServiceInterface {

  createProjectPeople(
    extensionId: Id,
    organizationId: Id,
    newInternalProjects: ProjectDbRow[],
    projectsPeople: UserInProjectJson[],
    trx: Transaction,
  ): Promise<UserInProjectJson[]>

}
