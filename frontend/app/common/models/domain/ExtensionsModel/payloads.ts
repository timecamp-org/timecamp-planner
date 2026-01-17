import { ExtensionNamespace, TargetType } from 'models/domain/ExtensionsModel/types'
import { Id } from 'common/utils/identifier'

export type OnFetchCustomRelationPayload = {
  namespace: ExtensionNamespace,
  targetType: TargetType,
  targetId: Id,
}
