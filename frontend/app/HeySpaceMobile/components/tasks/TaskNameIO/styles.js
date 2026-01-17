import { StyleSheet } from 'react-native'

import {
  whiteColor,
  whiteTwoColor
} from 'common/commonStyles/colors'
import {
  gridCellSize,
  largeBorderRadius,
} from 'styles/common'

const styles = StyleSheet.create({
  component: {

  },
  taskNameWrapper: {
    width: '100%',
    maxHeight: 14 * gridCellSize,
  },
  taskNameText: {

  },
  taskInput: {
    width: '100%',
    maxHeight: 14 * gridCellSize,
    borderRadius: largeBorderRadius,
    borderWidth: 1,
    borderColor: whiteColor,
    backgroundColor: whiteTwoColor,
  }
})

export default styles
