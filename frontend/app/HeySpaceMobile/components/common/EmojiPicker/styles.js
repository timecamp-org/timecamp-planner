import { StyleSheet, Dimensions } from 'react-native'
import { whiteTwoColor, grayColor, altoColor, amethystColor } from 'common/commonStyles/colors'
import { gridCellSize, mediumFontSize } from 'styles/common'

export const emojiSize = 8 * gridCellSize
export const categoryIconColor = grayColor
export const activeCategoryIconColor = amethystColor

const { width } = Dimensions.get('window')
const emojiMargin = gridCellSize
const emojiWidthWithMargin = emojiSize + (2 * emojiMargin)
export const numberOfEmojiColumns = parseInt(width / emojiWidthWithMargin, 10)
const emojiContainerMargin = (width - (numberOfEmojiColumns * emojiWidthWithMargin)) / 2

const styles = StyleSheet.create({
  emojiPicker: {
    backgroundColor: whiteTwoColor,
    width: '100%',
    height: '100%',
  },
  categories: {
    backgroundColor: whiteTwoColor,
    width: '100%',
    flexDirection: 'row',
    paddingLeft: gridCellSize,
    paddingRight: gridCellSize,
    borderBottomWidth: 1,
    borderBottomColor: altoColor,
  },
  categoryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: gridCellSize,
    paddingRight: gridCellSize,
    paddingTop: gridCellSize * 2,
    paddingBottom: gridCellSize * 2,
  },
  emojis: {
    paddingLeft: emojiContainerMargin,
    paddingRight: emojiContainerMargin,
  },
  emojiButton: {
    width: emojiSize,
    height: emojiSize,
    alignItems: 'center',
    justifyContent: 'center',
    margin: emojiMargin,
  },
  loaderWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: whiteTwoColor,
    width: '100%',
    height: '100%',
    zIndex: 10000,
  },
  input: {
    margin: gridCellSize,
    paddingBottom: gridCellSize,
    paddingTop: gridCellSize,
    paddingLeft: 2 * gridCellSize,
    paddingRight: 2 * gridCellSize,
    borderWidth: 1,
    borderColor: altoColor,
    borderRadius: gridCellSize,
    fontSize: mediumFontSize,
  },
})

export default styles
