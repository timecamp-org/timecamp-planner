import { StyleSheet } from 'react-native'
import { gridCellSize, defaultFontFamily, smallBorderRadius, mediumFontSize } from 'styles/common'
import { blackColor, iOSSettingsBackground, whiteTwoColor } from 'common/commonStyles/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5 * gridCellSize,
    backgroundColor: iOSSettingsBackground,
  },
  colorItemWrapper: {
    width: '100%',
  },
  colorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 9 * gridCellSize,
    paddingLeft: 6 * gridCellSize,
    paddingRight: 3 * gridCellSize,
    backgroundColor: whiteTwoColor,
  },
  colorSquare: {
    width: 4 * gridCellSize,
    height: 4 * gridCellSize,
    borderRadius: smallBorderRadius,
  },
  colorName: {
    fontFamily: defaultFontFamily,
    fontSize: mediumFontSize,
    color: blackColor,
    marginLeft: 8 * gridCellSize,
  },
  selectedMark: {
    marginLeft: 'auto',
    width: 22,
    height: 17,
  },
})

export default styles
