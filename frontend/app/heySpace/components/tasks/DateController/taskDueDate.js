import DateController from './index'

import EnhanceTaskDueDateController from './enhancers/EnhanceTaskDueDateController'
import EnhanceWithTaskColor from 'enhancers/EnhanceWithTaskColor'

export default EnhanceWithTaskColor(EnhanceTaskDueDateController(DateController))
