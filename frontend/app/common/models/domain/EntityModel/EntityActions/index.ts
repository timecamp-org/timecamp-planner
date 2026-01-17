import entityActionDescriptors from './entityActionDescriptors'
import activityActionDescriptors from './activityActionDescriptors'
import {
  ActivityActionCreator,
  ActivityType, BaseWrappedActivity,
  EntityActionCreator,
  EntityInterface,
  EntityOrActivityActionCreator,
  EntityType
} from '../types'
import { OperationType } from '../types'
import handleError from '../../../../utils/handleError'

class EntityActions {

  getActivityType<TActivity extends BaseWrappedActivity>(activity: TActivity): ActivityType {
    return activity.type
  }

  getEntityAction(entityType: EntityType, operation: OperationType): EntityActionCreator {
    const actionDescriptor = entityActionDescriptors[entityType]
    if (!actionDescriptor) {
      return null
    }
    switch (operation) {
      case OperationType.INSERT: return actionDescriptor.create
      case OperationType.UPDATE: return actionDescriptor.update
      case OperationType.DELETE: return actionDescriptor.delete
      default: {
        handleError('Unsupported operation: ', operation)
        return null
      }
    }
  }

  getActivityAction(activityType: ActivityType): ActivityActionCreator {
    return activityActionDescriptors[activityType]
  }

  getActionFromActivity(activity: EntityInterface): EntityOrActivityActionCreator {
    switch (this.getActivityType(activity)) {
      case ActivityType.MESSAGE:
      case ActivityType.ENTITY:
      case ActivityType.ENTITY_DIFF:
        return this.getEntityAction(activity.entityType, activity.operation)
      default: return this.getActivityAction(activity.type)
    }
  }

}

export default EntityActions
