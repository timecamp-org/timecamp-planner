import { Id } from '../../common/identifier';
import { FileDbRow, MessageContainerType } from '../../db/schema';
import { UploadRequest, SignUploadRequestResult, GetMessageContainerImageFilesResult, CreateFileResult, DeleteFileResult } from '../types';


export interface FileServiceInterface {
  createFile(id: Id, userId: Id, file: FileDbRow): Promise<CreateFileResult>

  deleteFile(id: Id): Promise<DeleteFileResult>

  doDeleteFile(trx: Transaction, id: Id): Promise<DeleteFileResult>

  signUploadRequest(uploadRequest: UploadRequest): Promise<SignUploadRequestResult>;

  getMessageContainerImageFiles(containerType: MessageContainerType, containerId: Id, page: string, limit: number): Promise<GetMessageContainerImageFilesResult>

  generateThumbnailUrl(file: FileDbRow, width: number, height: number, boundingBox: true) : PromiseLike<string>

  getFileById(fileId: Id): PromiseLike<FileDbRow>;
}
