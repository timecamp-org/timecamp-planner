import { Dimensions, StyleSheet } from 'react-native'
import { blackColor } from 'common/commonStyles/colors'
import { gridCellSize, navTitleFontSize } from 'styles/common'
const deviceWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
  titleText: {
    textAlign: 'center',
    color: blackColor,
    fontSize: navTitleFontSize,
    width: deviceWidth - (16 * gridCellSize)
  },
})

export default styles
