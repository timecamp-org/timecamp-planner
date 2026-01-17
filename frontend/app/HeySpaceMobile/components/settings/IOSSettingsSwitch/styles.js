import { StyleSheet } from 'react-native'

import { iOSSettingsSecondaryTextColor } from 'common/commonStyles/colors'
import { gridCellSize, defaultFontFamily, navTitleFontSize } from 'styles/common'

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginRight: 2 * gridCellSize,
    color: iOSSettingsSecondaryTextColor,
    fontFamily: defaultFontFamily,
    fontSize: navTitleFontSize,
  },
})

export default styles
