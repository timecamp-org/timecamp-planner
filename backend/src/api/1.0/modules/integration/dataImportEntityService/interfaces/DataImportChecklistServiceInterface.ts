import { Id } from '../../../common/identifier';
import { TaskDbRow, ChecklistItemDbRow } from '../../../db/schema';

import { ExternalChecklist } from '../../types';

export interface DataImportChecklistServiceInterface {

  createChecklists(
    extensionId: Id,
    organizationId: Id,
    newInternalTasks: TaskDbRow[],
    externalChecklists: Partial<ExternalChecklist>[],
    trx: Transaction,
  ): Promise<ChecklistItemDbRow[]>

}
