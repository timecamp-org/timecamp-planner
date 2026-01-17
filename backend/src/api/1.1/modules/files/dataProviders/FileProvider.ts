import { inject, injectable } from 'inversify';
import { first } from 'lodash';
import { EntityStatus } from '../../common/enum';
import { Id } from '../../common/identifier';
import Table from '../../db/Table';
import { FileProviderInterface } from '../interfaces/FileProviderInterface';
import { FileJson } from '../types';

import { ConnectionInterface } from '../../db/ConnectionInterface';
import { DbModule } from '../../db/DbModule';
import { FileDbRow } from '../../db/schema';
import { FileWithTaskId } from '../../db/types';

@injectable()
export class FileProvider implements FileProviderInterface {
  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {}

  async createFile(file: FileJson, trx?: Transaction): Promise<FileDbRow> {
    const query = this.connection.getQueryWithTransaction(trx);
    const result = await query.insert(file).into(Table.FILE).returning('*');
    return first(result);
  }

  async getFilesByIds(filesIds: Id[], trx?: Transaction): Promise<FileDbRow[]> {
    const query = this.connection.getQueryWithTransaction(trx);
    return await query.from(Table.FILE).whereIn('id', filesIds).whereNot('status', EntityStatus.DELETED);
  }

  async getFileById(fileId: Id, trx?: Transaction): Promise<FileDbRow> {
    const query = this.connection.getQueryWithTransaction(trx);
    return await query.from(Table.FILE).where('id', fileId).whereNot('status', EntityStatus.DELETED).first();
  }

  async deleteFile(fileId: Id, trx?: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx);
    await query
      .from(Table.FILE)
      .where('id', fileId)
      .whereNot('status', EntityStatus.DELETED)
      .update('status', EntityStatus.DELETED);
  }

  public async getOrganizationTotalFilesSize(organizationId: Id, trx?: Transaction): Promise<number> {
    const query = this.connection.getQueryWithTransaction(trx);
    const organizationFileSizes = await query
      .from(Table.FILE)
      .sum('size')
      .where('organizationId', organizationId)
      .where('status', EntityStatus.EXISTS)
      .first();

    return parseInt(organizationFileSizes.sum);
  }

  public async getProjectFiles(projectId: Id, trx?: Transaction): Promise<FileWithTaskId[]> {
    const [messageFiles, taskFiles, projectFiles]: [FileDbRow[], FileWithTaskId[], FileDbRow[]] = await Promise.all([
      this.connection
        .getQueryWithTransaction(trx)
        .select(`${Table.FILE}.*`)
        .from(Table.FILE)
        .join(Table.MESSAGE_FILE, `${Table.FILE}.id`, `${Table.MESSAGE_FILE}.file_id`)
        .join(
          Table.MESSAGE_CONTAINER_PROJECT,
          `${Table.MESSAGE_FILE}.message_id`,
          `${Table.MESSAGE_CONTAINER_PROJECT}.message_id`
        )
        .where(`${Table.MESSAGE_CONTAINER_PROJECT}.projectId`, projectId)
        .whereNot('status', EntityStatus.DELETED),
      this.connection
        .getQueryWithTransaction(trx)
        .select()
        .from(Table.TASK_ATTACHMENT)
        .whereIn('taskId', function () {
          this.select('id').from(Table.TASK).where('project_id', projectId);
        })
        .join(Table.FILE, `${Table.TASK_ATTACHMENT}.fileId`, '=', 'id')
        .whereNot('status', EntityStatus.DELETED),
      this.connection
        .getQueryWithTransaction(trx)
        .select()
        .from(Table.PROJECT_FILE)
        .where('projectId', projectId)
        .join(Table.FILE, `${Table.PROJECT_FILE}.fileId`, '=', 'id'),
    ]);

    return messageFiles.concat(taskFiles, projectFiles).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
