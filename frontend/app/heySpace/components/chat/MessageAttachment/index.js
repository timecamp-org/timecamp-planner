import Component from './component'

import EnhanceMessageAttachment from './enhancers/EnhanceMessageAttachment'
import EnhanceWithEntityType from 'enhancers/EnhanceWithEntityType'

export default EnhanceWithEntityType(EnhanceMessageAttachment(Component))
