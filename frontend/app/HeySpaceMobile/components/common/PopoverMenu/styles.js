import { StyleSheet } from 'react-native'

import {
  whiteTwoColor,
} from 'common/commonStyles/colors'
import {
  gridCellSize,
} from 'styles/common'

const styles = StyleSheet.create({
  popover: {
    backgroundColor: whiteTwoColor,
  },
  item: {
    padding: 2 * gridCellSize,
  },
})

export default styles
