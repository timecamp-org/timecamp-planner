import Component from './component'

import EnhanceTaskProgressEstimateEditable from './enhancers/EnhanceTaskProgressEstimateEditable'
import EnhanceWithTaskColor from 'enhancers/EnhanceWithTaskColor'

export default EnhanceWithTaskColor(EnhanceTaskProgressEstimateEditable(Component))
