import Component from './component'

import EnhanceAppController from './enhancers/EnhanceAppController'
import EnhanceCustomEventsTracker from '../../enhancers/EnhanceCustomEventsTracker'

export default EnhanceAppController(EnhanceCustomEventsTracker(Component))
