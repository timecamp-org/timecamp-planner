import component from './component'
import EnhanceNotificationText from './enhancers/EnhanceNotificationText'
import EnhanceWithCurrentUserId from '../../../enhancers/EnhanceWithCurrentUserId'

export default EnhanceNotificationText(EnhanceWithCurrentUserId(component))
