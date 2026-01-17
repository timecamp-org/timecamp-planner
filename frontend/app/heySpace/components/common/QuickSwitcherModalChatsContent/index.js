import Component from './component'

import EnhanceQuickSwitcherModalChatsContent from './enhancers/EnhanceQuickSwitcherModalChatsContent'

import EnhanceWithDynamicItems from '../../../../common/enhancers/EnhanceWithDynamicItems'

export default EnhanceQuickSwitcherModalChatsContent(
  EnhanceWithDynamicItems({
    itemIdsKey: 'filteredChatDescriptors',
    stepSize: 2,
})(Component))
