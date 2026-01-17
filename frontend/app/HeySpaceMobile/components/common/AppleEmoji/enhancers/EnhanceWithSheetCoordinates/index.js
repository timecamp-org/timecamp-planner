import React from 'react'
import PropTypes from 'prop-types'
import BaseComponent from 'BaseComponent'
import emojis from 'emoji-datasource-apple/emoji.json'
import values from 'lodash/values'

function Enhance(ComposedComponent) {
  class EnhanceWithSheetCoordinates extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      emojiCode: PropTypes.string.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          {...this.getEmojiCoordinates()}
        />
      )
    }

    getEmojiCoordinates() {
      const { emojiCode, skinTone } = this.extractEmojiData(this.props.emojiCode)
      let emoji = emojis.find(item => item.short_name === emojiCode)
      if (emoji && emoji.skin_variations && skinTone) {
        emoji = this.parseEmojiSkinVariation(emoji, skinTone)
      }
      return {
        sheetX: emoji ? emoji.sheet_x : 0,
        sheetY: emoji ? emoji.sheet_y : 0,
      }
    }

    extractEmojiData(emojiCode) {
      const emojiParts = emojiCode.split('::')
      const [emojiPart, skinPart] = emojiParts

      return {
        emojiCode: emojiPart.replace(/:/g, ''),
        skinTone: skinPart ? skinPart.replace(/:/g, '') : null,
      }
    }

    parseEmojiSkinVariation(emoji, skinTone) {
      const skinVariations = emoji.skin_variations
      const skinToneOrder = parseInt(skinTone.replace('skin-tone-', ''))
      
      // we subtract order by 2 because emoji-mart has 6 skin tones and emoji-datasource-apple has 5 skin-tones
      const skinnedEmoji = values(skinVariations)[skinToneOrder - 2]
      if (skinnedEmoji) {
        return skinnedEmoji
      } else {
        return emoji
      }
    }

  }

  return (EnhanceWithSheetCoordinates)
}

export default (Enhance)
