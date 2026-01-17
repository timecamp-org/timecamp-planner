import { StyleSheet } from 'react-native'
import { blackColor, whiteTwoColor, wisteriaColor } from 'common/commonStyles/colors'
import { gridCellSize, largeFontSize, defaultBorderRadius } from 'styles/common'

const styles = StyleSheet.create({
  component: {
    backgroundColor: whiteTwoColor,
    padding: 4 * gridCellSize,
    marginHorizontal: 2 * gridCellSize,
    borderRadius: defaultBorderRadius,
  },
  header: {
    fontSize: largeFontSize,
    color: blackColor,
  },
  positionInputWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footer: {
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginTop: 2 * gridCellSize,
  },
  footerButtonText: {
    padding: gridCellSize,
    fontSize: largeFontSize,
    color: wisteriaColor,
  },
})

export default styles
