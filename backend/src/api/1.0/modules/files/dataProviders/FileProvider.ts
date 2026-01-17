import { FileProviderInterface } from '../interfaces/FileProviderInterface'
import { Id } from '../../common/identifier'
import Table from '../../db/Table'
import { EntityStatus } from '../../common/enum'
import { injectable, inject } from 'inversify'
import { FileDbRow } from '../../db/schema';
import { FileJson } from '../types';
import { first } from 'lodash'

import { ConnectionInterface } from '../../db/ConnectionInterface'
import { DbModule } from '../../db/DbModule'

@injectable()
export class FileProvider implements FileProviderInterface {

  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ){}

  async createFile(file: FileJson, trx?: Transaction): Promise<FileDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    const result = await query
      .insert(file)
      .into(Table.FILE)
      .returning('*')
    return first(result)
  }

  async getFilesByIds(filesIds: Id[], trx?: Transaction): Promise<FileDbRow[]> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .from(Table.FILE)
      .whereIn('id', filesIds)
      .whereNot('status', EntityStatus.DELETED)
  }

  async getFileById(fileId: Id, trx?: Transaction): Promise<FileDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .from(Table.FILE)
      .where('id', fileId)
      .whereNot('status', EntityStatus.DELETED)
      .first()
  }

  async deleteFile(fileId: Id, trx?: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx)
    await query
      .from(Table.FILE)
      .where('id', fileId)
      .whereNot('status', EntityStatus.DELETED)
      .update('status', EntityStatus.DELETED)
  }

  public async getOrganizationTotalFilesSize(organizationId: Id, trx?: Transaction): Promise<number> {
    const query = this.connection.getQueryWithTransaction(trx)
    const organizationFileSizes = await query
      .from(Table.FILE)
      .sum('size')
      .where('organizationId', organizationId)
      .where('status', EntityStatus.EXISTS)
      .first()

    return parseInt(organizationFileSizes.sum)
  }
}
