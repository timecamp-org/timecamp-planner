import React, { memo } from 'react'
import { View, Image } from 'react-native'
import PropTypes from 'prop-types'
import emojisImage from './assets/emojis.png'

const sheetColumns = 52

EmojiPicker.propTypes = {
  sheetY: PropTypes.number.isRequired,
  sheetX: PropTypes.number.isRequired,
  emojiSize: PropTypes.number.isRequired,
}

function EmojiPicker(props) {
  return (
    <View style={{
      width: props.emojiSize,
      height: props.emojiSize,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Image
        style={{
          position: 'absolute',
          width: sheetColumns * props.emojiSize,
          height: sheetColumns * props.emojiSize,
          top: -props.emojiSize * props.sheetY,
          left: -props.emojiSize * props.sheetX,
        }}
        source={emojisImage}
      />
    </View>
  )
}

export default memo(EmojiPicker)
