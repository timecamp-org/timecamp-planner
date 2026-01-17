import { StyleSheet } from 'react-native'

import { whiteTwoColor, iOSSettingsBackground } from 'common/commonStyles/colors'
import { gridCellSize } from 'styles/common'
import isIOS from '../../../utils/isIOS'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isIOS ? iOSSettingsBackground : whiteTwoColor,
    paddingBottom: 5 * gridCellSize,
  },
})

export default styles
