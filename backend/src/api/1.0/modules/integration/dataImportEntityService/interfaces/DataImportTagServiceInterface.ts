import { Id } from "../../../common/identifier";
import { TagDbRow, TaskDbRow, TaskHasTagDbRow } from "../../../db/schema";

import { ExternalEntityIdsByExternalEntityId } from "../../types";

export interface DataImportTagServiceInterface {

  createTags(
    extensionId: Id,
    organizationId: Id,
    externalTags: Partial<TagDbRow>[],
    trx: Transaction,
  ): Promise<TagDbRow[]>

  createTaskTags(
    extensionId: Id,
    organizationId: Id,
    newInternalTasks: TaskDbRow[],
    externalTagIdsByExternalTaskId: ExternalEntityIdsByExternalEntityId,
    trx: Transaction,
  ): Promise<TaskHasTagDbRow[]>

}
