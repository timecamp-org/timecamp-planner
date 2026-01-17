import Component from './component'

import EnhanceFileMessage from './enhancers/EnhanceFileMessage'
import EnhanceWithFileDownload from '../../../enhancers/EnhanceWithFileDownload'

export default EnhanceWithFileDownload(EnhanceFileMessage(Component))
