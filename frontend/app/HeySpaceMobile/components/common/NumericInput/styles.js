import { StyleSheet } from 'react-native'
import { gridCellSize, largeBorderRadius, largeFontSize } from 'styles/common'
import { bahamaBlueColor, whiteTwoColor } from 'common/commonStyles/colors'

const elementSize = 8 * gridCellSize

const styles = StyleSheet.create({
  component: {
    flexDirection: 'row',
    height: elementSize,
  },
  button: {
    backgroundColor: bahamaBlueColor,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: elementSize,
  },
  leftButton: {
    borderBottomLeftRadius: largeBorderRadius,
    borderTopLeftRadius: largeBorderRadius,
  },
  rightButton: {
    borderBottomRightRadius: largeBorderRadius,
    borderTopRightRadius: largeBorderRadius,
  },
  valueContainer: {
    borderColor: bahamaBlueColor,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: '100%',
    minWidth: 10 * gridCellSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    fontSize: largeFontSize,
    color: whiteTwoColor,
  },
})

export default styles
