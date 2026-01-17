import { StyleSheet } from 'react-native'
import { darkTwoColor } from 'common/commonStyles/colors'
import { normalFontSize, smallerFontSize } from 'styles/common'

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 'auto',
  },
  normalText: {
    color: darkTwoColor,
    fontSize: normalFontSize,
  },
  smallText: {
    color: darkTwoColor,
    fontSize: smallerFontSize,
  },
})

export default styles
