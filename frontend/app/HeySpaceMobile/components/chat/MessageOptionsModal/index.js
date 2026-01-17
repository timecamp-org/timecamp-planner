import Component from './component'

import EnhanceMessageOptionsModal from './enhancers/EnhanceMessageOptionsModal'
import EnhanceWithCopyMessageAction from './enhancers/EnhanceWithCopyMessageAction'

export default EnhanceWithCopyMessageAction(
  EnhanceMessageOptionsModal(
    Component
  )
)
