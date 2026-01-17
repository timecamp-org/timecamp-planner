import { Id } from '../../../common/identifier';
import { TaskDbRow } from '../../../db/schema';


export interface DataImportTaskServiceInterface {

  createTasks(
    extensionId: Id,
    organizationId: Id,
    userId: Id,
    externalTasks: Partial<TaskDbRow>[],
    trx: Transaction,
  ): Promise<TaskDbRow[]>

}
