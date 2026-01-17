import { StyleSheet } from 'react-native'
export const hairlineWidth = StyleSheet.hairlineWidth

import { blackColor, whiteTwoColor, warmGreyTwoColor, blueGreyColor } from 'common/commonStyles/colors'
import { gridCellSize, largeFontSize, normalFontSize } from 'styles/common'

const actionSheetBorderRadius = 14
const actionSheetMargin = 2 * gridCellSize
const buttonHeight = gridCellSize * 11

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.4,
    backgroundColor: blackColor,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row'
  },
  body: {
    flex: 1,
    alignSelf: 'flex-end',
  },
  titleBox: {
    borderTopLeftRadius: actionSheetBorderRadius,
    borderTopRightRadius: actionSheetBorderRadius,
    height: gridCellSize * 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: whiteTwoColor,
    marginLeft: actionSheetMargin,
    marginRight: actionSheetMargin,
  },
  titleText: {
    color: warmGreyTwoColor,
    fontSize: normalFontSize,
  },
  buttonBox: {
    height: buttonHeight,
    marginTop: hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: whiteTwoColor,
  },
  cancelButtonBox: {
    height: buttonHeight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: whiteTwoColor,
    borderRadius: actionSheetBorderRadius,
    margin: actionSheetMargin,
  },
  cancelButtonBoxText: {
    color: blueGreyColor,
    fontSize: largeFontSize,
  },
  lastButton: {
    borderBottomLeftRadius: actionSheetBorderRadius,
    borderBottomRightRadius: actionSheetBorderRadius,
  },
  options: {
    marginLeft: actionSheetMargin,
    marginRight: actionSheetMargin,
  },
})

export default styles
