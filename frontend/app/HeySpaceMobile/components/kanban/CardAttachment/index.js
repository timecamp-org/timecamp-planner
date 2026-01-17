import Component from './component'

import EnhanceCardAttachment from './enhancers/EnhanceCardAttachment'
import EnhanceWithFileDownload from '../../../enhancers/EnhanceWithFileDownload'

export default EnhanceWithFileDownload(EnhanceCardAttachment(Component))
