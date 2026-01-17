import { Id } from '../../../common/identifier';
import { ListDbRow } from '../../../db/schema';


export interface DataImportListServiceInterface {

  createLists(
    extensionId: Id,
    organizationId: Id,
    userId: Id,
    externalLists: Partial<ListDbRow>[],
    trx: Transaction,
  ): Promise<ListDbRow[]>

}
