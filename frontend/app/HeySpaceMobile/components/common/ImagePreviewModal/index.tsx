import * as React from 'react'
import { Modal, TouchableOpacity } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useComponent } from './hook'
import { black60Color } from 'common/commonStyles/colors'
import X from '../../Icons/X'
import styles from './styles'
import { whiteTwoColor } from 'common/commonStyles/colors'

export const ImagePreviewModal: React.FC = () => {
  const {
    onCloseModal,
    isOpen,
    fileUrl,
  } = useComponent()

  return (
    <Modal visible={isOpen} transparent={true}>
      <ImageViewer 
        imageUrls={[{
          url: fileUrl
        }]}
        backgroundColor={black60Color}
        enableSwipeDown={true}
        onCancel={onCloseModal}
        renderIndicator={() => {}}
        renderHeader={() => (
          <TouchableOpacity onPress={onCloseModal} style={styles.header}>
            <X style={styles.icon} color={whiteTwoColor} />
          </TouchableOpacity>

        )}
      />
    </Modal>

  )
}

export default ImagePreviewModal