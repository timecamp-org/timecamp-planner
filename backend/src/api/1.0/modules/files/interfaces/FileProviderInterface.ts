import { Id } from '../../common/identifier'
import { FileJson } from '../types';
import { FileDbRow } from '../../db/schema';


export interface FileProviderInterface {
  createFile(file: FileJson, trx?: Transaction): PromiseLike<FileDbRow>;

  deleteFile(fileId: Id, trx?: Transaction): PromiseLike<void>;

  getFilesByIds(filesIds: Id[], trx?: Transaction): PromiseLike<FileDbRow[]>;

  getFileById(fileId: Id, trx?: Transaction): PromiseLike<FileDbRow>;

  getOrganizationTotalFilesSize(organizationId: Id, trx?: Transaction): PromiseLike<number>;
}
