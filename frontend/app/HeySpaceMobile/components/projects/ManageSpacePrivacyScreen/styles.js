import { StyleSheet } from 'react-native'
import { gridCellSize } from 'styles/common'
import { iOSSettingsBackground } from 'common/commonStyles/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5 * gridCellSize,
    backgroundColor: iOSSettingsBackground,
  },
})

export default styles
