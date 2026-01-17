import { CustomRelationColumnDbRow, CustomRelationDbRow, ExtensionDbRow } from '../db/schema'
import { NamingConvention } from '../../../../utils'
import { inject, injectable } from 'inversify'
import { DbModule } from '../db/DbModule'
import { AnyDict } from '../common/types'
import ConventionConverter = NamingConvention.ConventionConverter
import { Schema } from '../db/Table';
import { CustomRelationSqlFactoryInterface } from './interfaces/CustomRelationSqlFactoryInterface';
import { Knex } from 'knex'

@injectable()
export class RelationNameFactory
implements CustomRelationSqlFactoryInterface {
  protected dbConvention: ConventionConverter;

  constructor(
    @inject(DbModule.NamingConverter) dbConvention: NamingConvention.ConventionConverter
  ) {
    this.dbConvention = dbConvention
  }

  getFullyQualifiedTableName(extension: ExtensionDbRow, relation: CustomRelationDbRow): string {
    return `${Schema.EXTENSION_DATA_SCHEMA}.${extension.namespace}_${relation.name}`;
  }

  createRelationUpdateQuery(
    qb: Knex,
    tableName: string,
    relationColumns: CustomRelationColumnDbRow[],
    data: AnyDict | AnyDict[]
  ) {
    const pkColumns = relationColumns.filter(c => c.isPk);
    const nonPkColumns = relationColumns.filter(c => !c.isPk);

    const allColumns = [].concat(pkColumns, nonPkColumns).map(c => c.name);
    const allColumnNames = allColumns.map(n => qb.raw('??', n)).join(', ');
    const allColumnValues = Array.isArray(data)
      ? data.map(rowValues => this.createRowValues(rowValues, allColumns, qb)).join('), (')
      : this.createRowValues(data, allColumns, qb);
    const onConflictColumns = pkColumns.map(c => qb.raw('??', c.name)).join(',');
    let onConflictAction = 'DO NOTHING';
    if (nonPkColumns.length > 0) {
      // excluded is in postgres the currently being inserted row
      onConflictAction = 'DO UPDATE SET '.concat(nonPkColumns.map(nonPkColumn => `${nonPkColumn.name} = excluded.${nonPkColumn.name}`).join(', '))
    }
    
    let query = `INSERT INTO ${qb.raw('??', tableName)} (${allColumnNames}) VALUES (${allColumnValues}) `
    
    if (onConflictColumns.length) {
      query += `ON CONFLICT(${onConflictColumns}) ${onConflictAction}`;
    }

    return query
  }

  createRowValues(rowValues: AnyDict, allColumns: string[], qb): string {
    return allColumns.map(n => qb.raw('?', rowValues[n])).join(', ')
  }

  createRelationDeleteQuery(
    qb: Knex,
    tableName: string,
    relationColumns: CustomRelationColumnDbRow[],
    pkFields: AnyDict | AnyDict[]
  ): string {
    const pkColumns = relationColumns.filter(c => c.isPk);

    const pkWhereClause = Array.isArray(pkFields)
      ? pkFields.map(rowPkFields => this.createWhereClause(qb, rowPkFields, pkColumns)).join(' OR ')
      : this.createWhereClause(qb, pkFields, pkColumns)

    return `DELETE FROM ${qb.raw('??', tableName)} WHERE ${pkWhereClause}`;
  }

  createWhereClause(
    qb: Knex,
    pkFields: AnyDict,
    pkColumns: CustomRelationColumnDbRow[],
  ): string {
    return pkColumns
      .map(c => qb.raw('?? = ?', [c.name, pkFields[c.name]]))
      .join(' AND ')
  }

}
