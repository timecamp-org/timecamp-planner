import React from 'react'
import { StyleSheet, TouchableHighlight, Animated } from 'react-native'
import styles from './styles'
import { whiteTwoColor } from 'common/commonStyles/colors'
import { doNothing } from 'common/utils'
import FitImage from 'react-native-fit-image'
import useComponent, { ProgressiveImageHookInterface } from './hook'
import { ImageSize } from '../../../../common/models/domain/FilesModel/types'
import { GestureResponderHandler } from '../../../types'
import { AnyDict } from '../../../../common/types'
import { Id } from '../../../../common/utils/identifier'

const thumbnailAnimated = new Animated.Value(0);
const imageAnimated = new Animated.Value(0);
const handleThumbnailLoad = () => {
  Animated.timing(thumbnailAnimated, {
    toValue: 1,
    useNativeDriver: true,
  }).start();
}

const onImageLoad = () => {
  Animated.timing(imageAnimated, {
    toValue: 1,
    useNativeDriver: true
  }).start();
}

export type ProgressiveFileImageInterface = {
  fileId: Id,
  style: AnyDict,
  canUserDeleteMessage: boolean,
  shouldRenderGifAsPicture?: boolean,
  maxSize?: ImageSize,
  onLongPress: GestureResponderHandler,
  onDelete?: (fileId: Id) => void,
  isPreviewable: boolean,
}

const defaultProps = {
  canUserDeleteMessage: false,
  shouldRenderGifAsPicture: false,
  onPress: doNothing,
  onLongPress: doNothing,
  onDelete: doNothing,
  isPreviewable: true,
}

const ProgressiveFileImage: React.FC<ProgressiveFileImageInterface> = (props) => {
  const hook = useComponent(props)
  const shouldRenderFile = hook.fileContentType === 'image/gif' && !props.shouldRenderGifAsPicture

  return (
    <>
      <TouchableHighlight
        style={StyleSheet.flatten([styles.container, props.style, hook.dimensions])}
        onPress={hook.onPress}
        onLongPress={props.onLongPress}
        underlayColor={whiteTwoColor}
      >
        {
          shouldRenderFile
            ? renderFullImage(hook)
            : renderThumbnail(hook)
        }
      </TouchableHighlight>
    </>
  )
}

function renderFullImage(hook: ProgressiveImageHookInterface) {
  return (
    <FitImage
      indicator={false}
      resizeMode={'stretch'}
      style={hook.dimensions}
      source={{ uri: hook.fileUrl }}
    />
  )
}

function renderThumbnail(hook: ProgressiveImageHookInterface) {
  return (
    <>
      <Animated.Image
        resizeMode={'stretch'}
        source={{ uri: hook.tinyThumbnailUrl }}
        style={StyleSheet.flatten([hook.dimensions, { opacity: thumbnailAnimated }])}
        blurRadius={1}
        onLoad={handleThumbnailLoad}
      />
      <Animated.Image
        resizeMode={'stretch'}
        source={{ uri: hook.thumbnailUrl }}
        style={StyleSheet.flatten([hook.dimensions, styles.imageOverlay, { opacity: imageAnimated }])}
        onLoad={onImageLoad}
      />
    </>
  )
}

ProgressiveFileImage.defaultProps = defaultProps

export default ProgressiveFileImage
