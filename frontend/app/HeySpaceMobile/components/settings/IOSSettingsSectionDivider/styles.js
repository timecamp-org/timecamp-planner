import { StyleSheet } from 'react-native'

import { gridCellSize, defaultFontFamily } from 'styles/common'
import { iOSSettingsHeaderTextColor } from 'common/commonStyles/colors'

const styles = StyleSheet.create({
  container: {
    padding: 3 * gridCellSize,
  },
  title: {
    marginTop: 1 * gridCellSize,
    marginBottom: -1 * gridCellSize,
    fontFamily: defaultFontFamily,
    fontSize: 16,
    color: iOSSettingsHeaderTextColor,
  },
})

export default styles
