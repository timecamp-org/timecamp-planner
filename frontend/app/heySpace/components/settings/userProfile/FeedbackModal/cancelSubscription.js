import Component from './component'

import EnhanceFeedbackModal from './enhancers/EnhanceFeedbackModal'
import EnhanceCancelSubscriptionModal from './enhancers/EnhanceCancelSubscriptionModal'

export default EnhanceFeedbackModal(EnhanceCancelSubscriptionModal(Component))
