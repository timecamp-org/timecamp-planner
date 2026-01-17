import { CustomFieldProviderInterface } from '../interfaces/CustomFieldProviderInterface'
import { AbstractPostgresProvider } from '../../postgresDataProvider/AbstractPostgresProvider'
import { Id } from '../../common/identifier'
import { CustomFieldDbRow, CustomFieldTargetType, CustomFieldValueDbRow } from '../../db/schema'

import Table from '../../db/Table'
import { QueryModifier } from '../../../../../services/types';

export class CustomFieldProvider
  extends AbstractPostgresProvider
  implements CustomFieldProviderInterface {

  async getCustomFieldByName(
    extensionId: Id,
    targetType: CustomFieldTargetType,
    name: string,
    trx?: Transaction,
  ): Promise<CustomFieldDbRow> {
    return await this.connection.getQueryWithTransaction(trx)
      .select()
      .from(Table.EXTENSION_CUSTOM_FIELD)
      .where({ extensionId, targetType, name })
      .first()
    ;
  }

  async getCustomFieldValues(
    customFieldId: Id,
    targetType: CustomFieldTargetType,
    decorate?: QueryModifier,
    trx?: Transaction,
  ): Promise<CustomFieldValueDbRow[]> {
    const query = this.connection.getQueryWithTransaction(trx)
      .select()
      .from(Table.EXTENSION_CUSTOM_FIELD_VALUE)
      .where({
        targetType,
        fieldId: customFieldId
      })

    if (decorate) {
      decorate(query)
    }

    return await query
  }
}