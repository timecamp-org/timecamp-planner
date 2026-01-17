import { ContainerType } from '../../db/schema';
import { Id } from '../../common/identifier';


export interface AttachmentServiceInterface {
  isFileAttached(
    containerType: ContainerType,
    containerId: Id,
    fileId: Id,
    trx?: Transaction
  ): PromiseLike<boolean>;
}
