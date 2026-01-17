import Component from './component'

import EnhanceWorkspaceLogoController from './enhancers/EnhanceWorkspaceLogoController'
import EnhanceWithFileUpload from 'enhancers/EnhanceWithFileUpload'

export default EnhanceWithFileUpload(EnhanceWorkspaceLogoController(Component))
