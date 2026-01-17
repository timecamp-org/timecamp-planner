import Component from './component'

import EnhanceTaskList from './enhancers/EnhanceTaskList'
import EnhanceWithDynamicItems from '../../../../common/enhancers/EnhanceWithDynamicItems'

export default EnhanceTaskList(
  EnhanceWithDynamicItems({
  itemIdsKey: 'taskIds',
  containerKey: 'listId',
  stepSize: 5,
})
(Component)
)
