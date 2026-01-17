import { StyleSheet } from 'react-native'
import { iOSSettingsBackground } from 'common/commonStyles/colors'
import { gridCellSize, smallBorderRadius } from '../../../styles/common'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: iOSSettingsBackground,
  },
  infoIcon: {
    width: 4 * gridCellSize,
    height: 4 * gridCellSize,
    marginRight: 2 * gridCellSize,
  },
  colorSquare: {
    width: 3 * gridCellSize,
    height: 3 * gridCellSize,
    borderRadius: smallBorderRadius,
    marginRight: 2 * gridCellSize,
  },
})

export default styles
