import { StyleSheet } from 'react-native'
import { whiteTwoColor } from 'common/commonStyles/colors'
import { largeFontSize, gridCellSize } from 'styles/common'
import { Dimensions } from 'react-native';
const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  titleText: {
    color: whiteTwoColor,
    fontSize: largeFontSize,
    paddingRight: 4 * gridCellSize,
    width: deviceWidth - (24 * gridCellSize)
  },
})

export default styles
