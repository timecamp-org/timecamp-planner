import Table, { UniqueKey } from '../db/Table';
import { Id } from '../common/identifier';
import { DebugTools } from '../../../../debugTools';
import { FileDbRow, MessageContainerType } from '../db/schema';
import { violatesUniqueKey } from '../../../../utils';
import { PaginationServiceInterface } from '../pagination/interfaces/PaginationServiceInterface';
import { inject, injectable } from 'inversify';
import { PaginationModule } from '../pagination/PaginationModule';
import { FileStorageInterface } from '../fileStorage/FileStorageInterface';
import {
  CreateFileResult,
  CreateFileStatus,
  DeleteFileResult,
  DeleteFileStatus,
  UploadRequest,
  SignUploadRequestResult,
  SignUploadRequestStatus,
  GetMessageContainerImageFilesResult,
  GetMessageContainerImageFilesResultStatus,
  FileServiceOptions,
  FileJson,
} from './types';
import { FilesModule } from './FilesModule';
import { FileStorageModule } from '../fileStorage/FileStorageModule';
import { FileServiceInterface } from './interfaces/FileServiceInterface';
import { FileProviderInterface } from './interfaces/FileProviderInterface';

import { DbModule } from '../db/DbModule';
import { ConnectionInterface } from '../db/ConnectionInterface';
import { StandardPaginationToken, StandardPaginatorOptions } from '../pagination/types';
import { ProjectsModule } from '../projects/ProjectsModule';
import { ProjectFileProviderInterface } from '../projects/interfaces/ProjectFileProviderInterface';

@injectable()
export class FileService implements FileServiceInterface {
  constructor(
    @inject(FileStorageModule.FileStorageInterface)
    private fileStorage: FileStorageInterface,
    @inject(FilesModule.FileProviderInterface)
    private fileProvider: FileProviderInterface,
    @inject(FilesModule.FileServiceOptions)
    private options: FileServiceOptions,
    @inject(PaginationModule.StandardPaginationService)
    private standardPaginationService: PaginationServiceInterface<StandardPaginationToken, StandardPaginatorOptions>,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
    @inject(ProjectsModule.ProjectFileProviderInterface)
    private projectFileProvider: ProjectFileProviderInterface
  ) {}

  async createFile(id: Id, userId: Id, file: FileJson): Promise<CreateFileResult> {
    try {
      file.id = id;
      file.userId = userId;
      this.fileProvider.createFile(file);
      return { status: CreateFileStatus.OK };
    } catch (error) {
      if (violatesUniqueKey(error, UniqueKey.FILE_ID)) {
        return { status: CreateFileStatus.FILE_ALREADY_EXISTS };
      }
      throw error;
    }
  }

  async deleteFile(id: Id): Promise<DeleteFileResult> {
    return await this.connection.getConnection().transaction(async (trx) => {
      return await this.doDeleteFile(trx, id);
    });
  }

  async doDeleteFile(trx: Transaction, id: Id): Promise<DeleteFileResult> {
    const file = await this.fileProvider.getFileById(id, trx);
    if (!file) {
      return { status: DeleteFileStatus.FILE_NOT_FOUND };
    }
    await this.fileProvider.deleteFile(id, trx);
    await this.fileStorage.deleteFile(file.url);
    await this.projectFileProvider.deleteProjectFile(id);

    return { status: DeleteFileStatus.OK };
  }

  async signUploadRequest(uploadRequest: UploadRequest): Promise<SignUploadRequestResult> {
    const request = await this.fileStorage.createSignedUploadRequest(uploadRequest);

    if (this.options.debugMode) {
      DebugTools.generateCurlFromSignedUploadRequest(request);
    }

    if (!request) {
      return { status: SignUploadRequestStatus.ERROR };
    }

    return {
      status: SignUploadRequestStatus.OK,
      signedRequest: request,
    };
  }

  public async getMessageContainerImageFiles(
    containerType: MessageContainerType,
    containerId: Id,
    page: string,
    limit: number
  ): Promise<GetMessageContainerImageFilesResult> {
    const query = this.connection
      .getQueryBuilder()
      .select(`${Table.FILE}.*`)
      .from(`${Table.MESSAGE}`)
      .join(Table.MESSAGE_FILE, `${Table.MESSAGE_FILE}.message_id`, `${Table.MESSAGE}.id`)
      .join(Table.FILE, `${Table.MESSAGE_FILE}.file_id`, `${Table.FILE}.id`)
      .where(`${Table.MESSAGE}.container_id`, containerId)
      .where(`${Table.MESSAGE}.container_type`, containerType)
      .where(`${Table.FILE}.contentType`, 'like', 'image/%');

    const paginator = this.standardPaginationService.getPaginator(page, { limit, columns: ['createdAt', 'id'] });

    const files = await paginator.execute<FileDbRow>(query);

    return {
      status: GetMessageContainerImageFilesResultStatus.OK,
      files,
    };
  }

  async getFileById(fileId: Id): Promise<FileDbRow> {
    return await this.fileProvider.getFileById(fileId);
  }

  async generateThumbnailUrl(file: FileDbRow, width: number, height: number, boundingBox: true): Promise<string> {
    return await this.fileStorage.generateThumbnailUrl(file.url, width, height, boundingBox);
  }
}
