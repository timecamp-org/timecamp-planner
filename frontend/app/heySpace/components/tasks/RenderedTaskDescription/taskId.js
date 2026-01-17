import Component from './component'

import EnhanceRenderedTaskDescription from './enhncers/EnhanceRenderedTaskDescription'
import EnhanceWithTaskDescriptionSource from './enhancers/EnhanceWithTaskDescriptionSource'

export default EnhanceWithTaskDescriptionSource(EnhanceRenderedTaskDescription(Component))
