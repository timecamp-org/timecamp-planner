import { StyleSheet } from 'react-native'

import { whiteTwoColor, blackColor, brightRedColor, blueGreyColor } from 'common/commonStyles/colors'
import { defaultFontFamily, navTitleFontSize, gridCellSize } from 'styles/common'

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: whiteTwoColor,
    width: '100%',
  },
  textInput: {
    paddingVertical: 2 * gridCellSize,
    paddingHorizontal: 3 * gridCellSize,
    width: '100%',
    fontFamily: defaultFontFamily,
    fontSize: navTitleFontSize,
    color: blackColor,
  },
  validationMessageWrapper: {
    paddingHorizontal: 3 * gridCellSize,
  },
  validationMessage: {
    color: brightRedColor,
  },
  disabled: {
    color: blueGreyColor,
  }
})

export default styles
