import Component from './component'

import EnhanceQuickSwitcherModalCardsContent
  from './enhancers/EnhanceQuickSwitcherModalCardsContent'

import EnhanceWithDynamicItems from '../../../../common/enhancers/EnhanceWithDynamicItems'


export default EnhanceQuickSwitcherModalCardsContent(
  EnhanceWithDynamicItems({
    itemIdsKey: 'filteredDescriptors',
    stepSize: 2,
  })(Component)
)
