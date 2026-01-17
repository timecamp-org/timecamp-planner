import { Id } from '../../common/identifier';


export interface MessageAttachmentProviderInterface {
  isFileAttachedToMessages(fileId: Id, trx?: Transaction): PromiseLike<boolean>;
}
