import Component from './component'

import EnhanceCardTagsSection from './enhancers/EnhanceCardTagsSection'
import EnhanceCardDetailsSection from '../enhancers/EnhanceCardDetailsSection'

export default EnhanceCardDetailsSection(EnhanceCardTagsSection(Component))
