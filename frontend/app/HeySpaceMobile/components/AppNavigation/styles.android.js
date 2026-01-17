import { StyleSheet } from 'react-native'
import { darkTwoColor, whiteTwoColor } from 'common/commonStyles/colors'
import { boldFontWeight, largeFontSize } from 'styles/common'

const styles = StyleSheet.create({
  defaultNavHeader: {
    backgroundColor: darkTwoColor,
  },
  defaultNavHeaderTitle: {
    fontSize: largeFontSize,
    color: whiteTwoColor,
    fontWeight: boldFontWeight,
  },
})

export default styles