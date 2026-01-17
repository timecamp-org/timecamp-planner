import Component from './component'

import EnhanceWorkspaceMemberOptionsButton from './enhancers/EnhanceWorkspaceMemberOptionsButton'
import EnhanceWithCurrentOrganizationId from 'enhancers/EnhanceWithCurrentOrganizationId'

export default EnhanceWithCurrentOrganizationId(EnhanceWorkspaceMemberOptionsButton(Component))
