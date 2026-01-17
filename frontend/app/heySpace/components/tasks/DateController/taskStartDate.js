import DateController from './index'

import EnhanceTaskStartDateController from './enhancers/EnhanceTaskStartDateController'
import EnhanceWithTaskColor from 'enhancers/EnhanceWithTaskColor'

export default EnhanceWithTaskColor(EnhanceTaskStartDateController(DateController))
