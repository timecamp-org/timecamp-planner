import Component from './component'

import EnhanceCardDetailsSection from '../enhancers/EnhanceCardDetailsSection'
import EnhanceCardChecklistSection from './enhancers/EnhanceCardChecklistSection'

export default EnhanceCardDetailsSection(EnhanceCardChecklistSection(Component))
