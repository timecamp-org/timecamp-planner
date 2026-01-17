import component from './component'
import EnhanceNotificationText from './enhancers/EnhanceNotificationText'
import EnhanceWithCurrentUserId from 'enhancers/users/EnhanceWithCurrentUserId'

export default EnhanceNotificationText(EnhanceWithCurrentUserId(component))
