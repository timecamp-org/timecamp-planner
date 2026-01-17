import { StyleSheet } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { gridCellSize } from 'styles/common'
import isIOS from '../../../utils/isIOS'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    top: isIOS ? 9 * gridCellSize : 12 * gridCellSize,
    width: wp('100%'),
    zIndex: 9999,
    height: 2 * gridCellSize,
  },
})

export default styles
