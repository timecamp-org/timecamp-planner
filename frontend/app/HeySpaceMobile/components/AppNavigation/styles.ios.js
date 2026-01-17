import { StyleSheet } from 'react-native'
import { blackColor, lightGreyColor } from 'common/commonStyles/colors'
import { boldFontWeight, mediumFontSize } from 'styles/common'

const styles = StyleSheet.create({
  defaultNavHeader: {
    backgroundColor: lightGreyColor,
  },
  defaultNavHeaderTitle: {
    fontSize: mediumFontSize,
    color: blackColor,
    fontWeight: boldFontWeight,
  },
})

export default styles
