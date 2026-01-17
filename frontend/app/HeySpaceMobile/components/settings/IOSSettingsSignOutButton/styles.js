import { StyleSheet } from 'react-native'
import {
  gridCellSize,
  defaultFontFamily,
  navTitleFontSize
} from 'styles/common'
import { whiteTwoColor, brightRedColor } from 'common/commonStyles/colors'

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 2 * gridCellSize,
    backgroundColor: whiteTwoColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: defaultFontFamily,
    fontSize: navTitleFontSize,
    color: brightRedColor,
  },
})

export default styles
