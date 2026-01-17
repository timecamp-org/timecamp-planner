import { StyleSheet } from 'react-native'
import {
  largeBorderRadius,
  gridCellSize,
  normalFontSize,
} from 'styles/common'

const styles = StyleSheet.create({
  component: {
    flexDirection: 'row',
    flex: 1,
  },
  leftItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 7 * gridCellSize,
    marginHorizontal: gridCellSize,
    borderBottomLeftRadius: 7 * gridCellSize,
    borderTopLeftRadius: 7 * gridCellSize,
    borderBottomRightRadius: largeBorderRadius,
    borderTopRightRadius: largeBorderRadius,
  },
  middleItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 7 * gridCellSize,
    marginHorizontal: gridCellSize,
    borderRadius: largeBorderRadius,
  },
  rightItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 7 * gridCellSize,
    marginHorizontal: gridCellSize,
    borderBottomRightRadius: 7 * gridCellSize,
    borderTopRightRadius: 7 * gridCellSize,
    borderBottomLeftRadius: largeBorderRadius,
    borderTopLeftRadius: largeBorderRadius,
  },
  text: {
    fontSize: normalFontSize,
    fontWeight: 'bold',
  },
})

export default styles
