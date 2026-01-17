import Component from './component'

import EnhanceUserAvatar from './enhancers/EnhanceUserAvatar'
import EnhanceWithCurrentUserId from 'enhancers/users/EnhanceWithCurrentUserId'

export default EnhanceWithCurrentUserId(EnhanceUserAvatar(Component))
