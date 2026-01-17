import Component from './component'

import EnhanceImageGallery from './enhancers/EnhanceImageGallery'
import EnhanceTaskAttachmentsGallery from './enhancers/EnhanceTaskAttachmentsGallery'

export default EnhanceTaskAttachmentsGallery(EnhanceImageGallery(Component))
