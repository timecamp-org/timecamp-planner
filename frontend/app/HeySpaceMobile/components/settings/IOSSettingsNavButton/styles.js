import { StyleSheet } from 'react-native'

import { blackColor } from 'common/commonStyles/colors'
import { gridCellSize } from 'styles/common'

const styles = StyleSheet.create({
  button: {
    paddingRight: 2 * gridCellSize,
    paddingVertical: 2 * gridCellSize,
  },
  text: {
    color: blackColor,
    fontSize: 17,
  },
  moreVerticalIcon: {
    height: 4 * gridCellSize,
    width: 3 * gridCellSize,
  },
})

export default styles
