import Component from './component'

import EnhanceWithNormalizeNewMessageInputEvents from './enhancers/EnhanceWithNormalizeNewMessageInputEvents'
import EnhanceNewMessageInput from './enhancers/EnhanceNewMessageInput'

export default EnhanceNewMessageInput(EnhanceWithNormalizeNewMessageInputEvents(Component))
