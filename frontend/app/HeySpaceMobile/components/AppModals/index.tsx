import * as React from 'react'
import RateUsModal from '../common/RateUsModal'
import ImagePreviewModal from '../common/ImagePreviewModal'

export const AppModals: React.FC = (): JSX.Element => (
  <>
    <RateUsModal />
    <ImagePreviewModal />
  </>
)

export default AppModals