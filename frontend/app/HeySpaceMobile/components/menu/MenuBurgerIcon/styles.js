import { StyleSheet } from 'react-native'
import { whiteTwoColor, blackColor } from 'common/commonStyles/colors'
import { gridCellSize } from 'styles/common'
import isIOS from '../../../utils/isIOS'

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 6 * gridCellSize,
    paddingHorizontal: 2 * gridCellSize,
  },
  burger: {
    position: 'relative',
    height: 4 * gridCellSize,
    width: 5 * gridCellSize,
    justifyContent: 'space-between',
  },
  iconPart: {
    height: 3,
    borderRadius: 1,
    backgroundColor: isIOS ? blackColor : whiteTwoColor,
  },
  badge: {
    position: 'absolute',
    top: -7,
    right: -7,
  },
})

export default styles
