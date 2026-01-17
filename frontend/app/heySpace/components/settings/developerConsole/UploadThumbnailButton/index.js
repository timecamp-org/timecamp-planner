import Component from './component'
import EnhanceUploadThumbnailButton from './enhancers/EnhanceUploadThumbnailButton'
import EnhanceWithFileUpload from 'enhancers/EnhanceWithFileUpload'

export default EnhanceWithFileUpload(
  EnhanceUploadThumbnailButton(
    Component
  )
)
