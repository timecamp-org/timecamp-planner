import Component from './component'
import EnhanceReaction from './enhancers/EnhanceReaction'
import EnhanceMessageReaction from './enhancers/EnhanceMessageReaction'

export default EnhanceMessageReaction(EnhanceReaction(Component))
