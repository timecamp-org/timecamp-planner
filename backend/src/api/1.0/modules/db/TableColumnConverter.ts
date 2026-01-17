import { DbRow, DbValue } from './types'
import { AnyDict, PropertiesOfType } from '../common/types'
import Table from './Table'
import { ConnectionInterface } from './ConnectionInterface'
import { inject, injectable } from 'inversify'
import { DbModule } from './DbModule'
import { LoggerInterface } from '../../../../infrastructure/logger'
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule'

@injectable()
export class TableColumnConverter
{
  protected connection: ConnectionInterface;
  protected logger: LoggerInterface;

  constructor(
    @inject(DbModule.ConnectionInterface)
      connection: ConnectionInterface,

    @inject(InfrastructureModule.LoggerInterface)
      logger: LoggerInterface,
  ) {
    this.connection = connection;
    this.logger = logger;
  }

  public async convert<T extends DbRow, P extends DbValue>(
    table: Table,
    columns: PropertiesOfType<T, P>[],
    converter: (input: P, column: PropertiesOfType<T, P>, row: T) => PromiseLike<P>,
  ): Promise<void> {

    const connection = this.connection.getConnection();

    const res = await connection.raw('SELECT * FROM ??', Table.TASK);

    for (const row of res.rows) {
      const id = row.id;
      await this.convertRow<T, P>(
        converter,
        columns,
        row,
        async (updatedFields: AnyDict) =>
        {
          this.connection.getQueryBuilder()
            .table(table)
            .update(updatedFields)
            .where({ id })
        }
      );
    }
  }

  protected async convertRow<T extends DbRow, P extends DbValue>(
    converter: (input: P, column: PropertiesOfType<T, P>, row: T) => PromiseLike<P>,
    columns: PropertiesOfType<T, P>[],
    row: T,
    save: (update: AnyDict) => PromiseLike<void>
  ): Promise<void> {
    const updatedData: AnyDict = {};

    let updatedCount = 0;

    for (const column of columns) {
      // TODO: FIX IT LATER, NO IDEA FOR NOW
      // @ts-ignore
      const input: P = row[ column ] as P;
      try {
        const converted = await converter(input, column, row);
        if (typeof converted !== 'undefined') {
          updatedCount ++;
          updatedData[ column as string ] = converted;
        }
      } catch (e) {
        this.logger.error(`${column}:invalid json -- not a quill source `);
      }
    }

    if (updatedCount === 0) {
      return;
    }

    await save(updatedData);
  }
}
