import { StyleSheet } from 'react-native'
import { gridCellSize, mediumFontSize, defaultFontFamily } from 'styles/common'
import { iOSSettingsBackground, iOSSettingsHeaderTextColor } from 'common/commonStyles/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 5 * gridCellSize,
    backgroundColor: iOSSettingsBackground,
  },
  image: {
    height: 38 * gridCellSize,
    width: 25 * gridCellSize,
    marginTop: 15 * gridCellSize,
  },
  text: {
    fontFamily: defaultFontFamily,
    color: iOSSettingsHeaderTextColor,
    fontSize: mediumFontSize,
  },
})

export default styles
