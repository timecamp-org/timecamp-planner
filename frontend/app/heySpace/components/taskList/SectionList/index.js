import EnhanceWithDynamicItems from '../../../../common/enhancers/EnhanceWithDynamicItems';

import Component from './component';
import EnhanceSectionList from './enhancers/EnhanceSectionList';

export default EnhanceSectionList(
  EnhanceWithDynamicItems({
    itemIdsKey: 'listIds',
    containerKey: 'projectId',
    stepSize: 2,
  })(Component)
);
