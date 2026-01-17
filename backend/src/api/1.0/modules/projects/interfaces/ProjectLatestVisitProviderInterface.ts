import { Id } from '../../common/identifier';

import { ProjectLatestVisitDbRow } from '../../db/schema';

export interface ProjectLatestVisitProviderInterface {

  insertOrUpdateProjectLatestVisit(userId: Id, organizationId: Id, projectId: Id, userInProjectId: Id, trx: Transaction): Promise<void>

  getProjectLatestVisit(userId: Id, organizationId: Id): Promise<ProjectLatestVisitDbRow>

}
