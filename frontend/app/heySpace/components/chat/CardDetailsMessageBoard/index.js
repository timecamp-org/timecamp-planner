import component from './component'

import EnhanceCardDetailsMessageBoard from './enhancers/EnhanceCardDetailsMessageBoard'
import EnhanceWithFileUpload from 'enhancers/EnhanceWithFileUpload'

/* eslint-disable function-paren-newline */
export default EnhanceCardDetailsMessageBoard(
  EnhanceWithFileUpload((component),
  ),
)
