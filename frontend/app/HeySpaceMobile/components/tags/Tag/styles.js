import { StyleSheet } from 'react-native'

import { whiteTwoColor } from 'common/commonStyles/colors'
import { gridCellSize } from 'styles/common'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 2 * gridCellSize,
    paddingVertical: gridCellSize,
    marginVertical: gridCellSize,
    borderRadius: 8 * gridCellSize,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: gridCellSize,
    maxHeight: gridCellSize * 6,
  },
  text: {
    color: whiteTwoColor,
    textAlign: 'center',
  },
})

export default styles
