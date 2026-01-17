import { StyleSheet } from 'react-native'
import { wisteriaColor } from 'common/commonStyles/colors'
import { gridCellSize } from 'styles/common'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 10 * gridCellSize,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultDotStyle: {
    backgroundColor: wisteriaColor,
    height: 4 * gridCellSize,
    width: 4 * gridCellSize,
    borderRadius: 2 * gridCellSize,
    marginHorizontal: 3 * gridCellSize,
  },
})

export default styles
