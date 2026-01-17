import Component from './component'

import EnhanceImageGallery from './enhancers/EnhanceImageGallery'
import EnhanceProjectMessageAttachmentsGallery from './enhancers/EnhanceProjectMessageAttachmentsGallery'

export default EnhanceProjectMessageAttachmentsGallery(EnhanceImageGallery(Component))
