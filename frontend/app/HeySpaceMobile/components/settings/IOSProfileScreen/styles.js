import { StyleSheet } from 'react-native'

import { iOSSettingsBackground } from 'common/commonStyles/colors'
import { gridCellSize } from 'styles/common'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: iOSSettingsBackground,
    paddingTop: 6 * gridCellSize,
  },
  avatarWrapper: {
    width: '100%',
    alignItems: 'center',
  },
})

export default styles
