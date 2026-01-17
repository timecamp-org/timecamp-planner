import { inject, injectable } from 'inversify';
import { ProjectFileProviderInterface } from '../interfaces/ProjectFileProviderInterface';
import { DbModule } from '../../db/DbModule';
import { ConnectionInterface } from '../../db/ConnectionInterface';
import { ProjectFileDbRow, FileDbRow } from '../../db/schema';
import Table from '../../db/Table';
import { first } from 'lodash';
import { Id } from '../../common/identifier';

@injectable()
export class ProjectFileProvider implements ProjectFileProviderInterface {
  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {}
  async createProjectFile(projectFile: ProjectFileDbRow): Promise<FileDbRow> {
    const connection = this.connection.getConnection();

    return (await connection.insert(projectFile).into(Table.PROJECT_FILE).returning('*').then(first)) as FileDbRow;
  }

  async deleteProjectFile(fileId: Id): Promise<void> {
    const connection = this.connection.getConnection();
    return await connection.from(Table.PROJECT_FILE).where({ fileId }).del();
  }
}
