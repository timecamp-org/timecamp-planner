import { PaginatedResults } from '../pagination/types';
import { FileDbRow } from '../db/schema';
import { HttpScheme, HttpMethod } from '../../../../infrastructure/enum';
import { Id } from '../common/identifier';
import { CheckFileIsPermittedToUploadMessage } from '../payment/types'

export enum GetMessageContainerImageFilesResultStatus {
  OK, CONTAINER_NOT_FOUND,
}

export enum CreateFileStatus {
  OK,
  FILE_ALREADY_EXISTS,
}

export enum DeleteFileStatus {
  OK,
  FILE_NOT_FOUND,
}

export type GetMessageContainerImageFilesResult = {
  status: GetMessageContainerImageFilesResultStatus,
  files?: PaginatedResults<FileDbRow>,
}


export type HashAlgorithm = 'sha256';

export interface UploadRequest {
  /**
   * File name
   */
  name: string,

  organizationId: Id,
  size: number,

  /**
   * Amazon can sign upload requests for specific content.
   * If we ever decide to use that feature, then hash must
   * be provided (SHA256 of file content).
   */
  hash?: {
    [alg in HashAlgorithm]?: string
  },

  contentType: string,
}

export interface SignedUploadRequest {
  /**
   * Theoretically we can upload to multiple providers.
   * This field specifies which one the client should use.
   */
  provider: string,

  /**
   * Following parameters should be used to build request to provider.
   */
  scheme: HttpScheme,
  host: string,
  method: HttpMethod | string,
  path: string,
  headers: { [key: string]: string },

  /**
   * After upload the file will be available here
   */
  targetUri: string,

  fileId?: Id,
  name: string,
  mimeType: string,
}

export enum SignUploadRequestStatus {
  OK,
  ERROR,
  FILE_UPLOAD_NOT_PERMITTED,
}

export interface SignUploadRequestResult {
  status: SignUploadRequestStatus,
  message?: CheckFileIsPermittedToUploadMessage,
  signedRequest?: SignedUploadRequest
}

export interface CreateFileResult {
  status: CreateFileStatus,
}

export interface DeleteFileResult {
  status: DeleteFileStatus,
}

export interface FileServiceOptions {
  debugMode: boolean,
}

export type FileJson = Partial<FileDbRow>;
