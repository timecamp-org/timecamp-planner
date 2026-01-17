import Component from './component'

import EnhanceUserAvatarController from './enhancers/EnhanceUserAvatarController'
import EnhanceWithClickOutside from 'react-click-outside'
import EnhanceWithFileUpload from 'enhancers/EnhanceWithFileUpload'

export default EnhanceWithFileUpload(EnhanceUserAvatarController(EnhanceWithClickOutside(Component)))
