import { useMemo } from 'react'
import { Dimensions, GestureResponderEvent } from 'react-native'
import { messageLeftSize } from "../../chat/Message/styles"
import { ImageSize, DimensionsInterface } from '../../../../common/models/domain/FilesModel/types'
import { ProgressiveFileImageInterface } from "./index"
import { useDataPersister, useDataProvider } from './dataHooks'
import { getThumbnailUrl, getScaledThumbnailDimension } from '../../../../common/models/domain/FilesModel/helpers'
import { GestureResponderHandler } from '../../../types'

export interface ProgressiveImageHookInterface {
  dimensions: DimensionsInterface,
  fileContentType: string,
  fileUrl: string,
  thumbnailUrl: string,
  tinyThumbnailUrl: string,
  onPress: GestureResponderHandler,
  onOpenImagePreviewModal: VoidFunction,
}

const messageRightMargin = 20

export default function useComponent({
  maxSize = ImageSize.MEDIUM,
  fileId,
  canUserDeleteMessage,
  ...props
}: ProgressiveFileImageInterface): ProgressiveImageHookInterface {

  const {
    fileContentType,
    fileHeight,
    fileWidth,
    fileUrl,
  } = useDataProvider(fileId)

  const scaledDimensions = useMemo(
    () => getScaledDimensions(maxSize, fileHeight, fileWidth),
    [maxSize, fileHeight, fileWidth]
  )

  const { onOpenImagePreviewModal } = useDataPersister({ fileUrl })

  const onPress = (event: GestureResponderEvent) => {
    if (props.isPreviewable) {
      onOpenImagePreviewModal()
    } else {
      props.onLongPress(event)
    }
  }

  return {
    dimensions: scaledDimensions,
    fileContentType,
    fileUrl,
    thumbnailUrl: getThumbnailUrl(fileUrl, maxSize),
    tinyThumbnailUrl: getThumbnailUrl(fileUrl, ImageSize.TINY),
    onPress,
    onOpenImagePreviewModal,
  }
}

function getScaledDimensions(maxSize: number, fileHeight: number, fileWidth: number): DimensionsInterface {
  const window = Dimensions.get('window')

  const maxWidth = window.width - messageLeftSize - messageRightMargin

  return getScaledThumbnailDimension(fileWidth, fileHeight, maxWidth, maxSize)
}
