import component from './component'
import EnhanceWorkspacesPanel from './enhancers/EnhanceWorkspacesPanel'
import EnhanceWithDynamicItems from '../../../../common/enhancers/EnhanceWithDynamicItems'


export default EnhanceWorkspacesPanel(
  EnhanceWithDynamicItems({
    itemIdsKey: 'organizationIds',
    stepSize: 2,
  })(component)
)
