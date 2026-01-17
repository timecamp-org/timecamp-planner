import Component from './component'

import EnhanceList from './enhancers/EnhanceList'
import EnhanceWithDynamicItems from '../../../../common/enhancers/EnhanceWithDynamicItems'

export default EnhanceList(
  EnhanceWithDynamicItems({
    itemIdsKey: 'taskIds',
    containerKey: 'listId',
    stepSize: 5,
  })(Component)
)
