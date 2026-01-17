import Component from './component'

import EnhanceFeedbackModal from './enhancers/EnhanceFeedbackModal'
import EnhanceDeleteAccountModal from './enhancers/EnhanceDeleteAccountModal'

export default EnhanceFeedbackModal(EnhanceDeleteAccountModal(Component))
