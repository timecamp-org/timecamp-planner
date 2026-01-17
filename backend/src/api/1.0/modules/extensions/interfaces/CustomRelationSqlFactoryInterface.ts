import { CustomRelationDbRow, CustomRelationColumnDbRow, ExtensionDbRow } from '../../db/schema'
import { AnyDict } from '../../common/types'

import { Knex } from 'knex'
export interface CustomRelationSqlFactoryInterface
{
  getFullyQualifiedTableName(extension: ExtensionDbRow, relation: CustomRelationDbRow) : string;


  createRelationUpdateQuery(
    qb: Knex,
    tableName: string,
    relationColumns: CustomRelationColumnDbRow[],
    data: AnyDict | AnyDict[]
  ): string;

  createRelationDeleteQuery(
    qb: Knex,
    tableNAme: string,
    relationColumns: CustomRelationColumnDbRow[],
    pkFields: AnyDict | AnyDict[]
  ): string;
}
