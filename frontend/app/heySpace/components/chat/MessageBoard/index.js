import component from './component'

import EnhanceMessageBoard from './enhancers/EnhanceMessageBoard'
import EnhanceWithFileUpload from 'enhancers/EnhanceWithFileUpload'

export default EnhanceMessageBoard(EnhanceWithFileUpload(component))
