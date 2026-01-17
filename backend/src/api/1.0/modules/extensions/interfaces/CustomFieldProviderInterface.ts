import { Id } from '../../common/identifier';
import { CustomFieldDbRow, CustomFieldTargetType, CustomFieldValueDbRow } from '../../db/schema';

import { QueryModifier } from '../../../../../services/types';

export interface CustomFieldProviderInterface {
  getCustomFieldByName(
    extensionId: Id,
    targetType: CustomFieldTargetType,
    name: string,
    trx?: Transaction,
  ): PromiseLike<CustomFieldDbRow>

  getCustomFieldValues(
    customFieldId: Id,
    targetType: CustomFieldTargetType,
    decorate?: QueryModifier,
    trx?: Transaction,
  ): PromiseLike<CustomFieldValueDbRow[]>
}