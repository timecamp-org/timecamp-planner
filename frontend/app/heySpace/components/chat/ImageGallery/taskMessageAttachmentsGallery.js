import Component from './component'

import EnhanceImageGallery from './enhancers/EnhanceImageGallery'
import EnhanceTaskMessageAttachmentsGallery from './enhancers/EnhanceTaskMessageAttachmentsGallery'

export default EnhanceTaskMessageAttachmentsGallery(EnhanceImageGallery(Component))
