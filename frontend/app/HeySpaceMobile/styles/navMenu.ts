import { StyleSheet } from 'react-native'

import { gridCellSize } from './common'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

const styles = StyleSheet.create({
  skeletonWrapper: {
    width: wp('85%'),
    flex: 1,
    height: gridCellSize * 40,
    paddingLeft: 8 * gridCellSize,
    paddingRight: 6 * gridCellSize,
  }
})

export default styles
