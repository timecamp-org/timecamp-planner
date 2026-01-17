import Component from './component'

import EnhanceProjectKanban from './enhancers/EnhanceProjectKanban'
import EnhanceWithDynamicItems from '../../../../common/enhancers/EnhanceWithDynamicItems'

export default EnhanceProjectKanban(
  EnhanceWithDynamicItems({
    itemIdsKey: 'listIds',
    containerKey: 'projectId',
    stepSize: 2,
  })(Component)
)
