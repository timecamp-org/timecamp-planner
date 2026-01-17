import component from './component'

import EnhanceCardEstimatedEffortController from './enhancers/EnhanceCardEstimatedEffortController'
import EnhanceWithTaskColor from 'enhancers/EnhanceWithTaskColor'

export default EnhanceWithTaskColor(EnhanceCardEstimatedEffortController(component))
