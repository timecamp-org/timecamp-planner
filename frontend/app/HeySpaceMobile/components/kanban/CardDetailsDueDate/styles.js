import { StyleSheet } from 'react-native'

import {
  cloudyBlueColor, whiteTwoColor,
} from 'common/commonStyles/colors'
import {
  gridCellSize,
  mediumFontSize,
} from 'styles/common'

const styles = StyleSheet.create({
  component: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // dirty fix for react-native-svg elements triggering touch events outside of touchable parent component
  },
  calendarIcon: {
    height: 6 * gridCellSize,
    width: 6 * gridCellSize,
  },
  taskDueDate: {
    marginLeft: 2 * gridCellSize,
    color: cloudyBlueColor,
    fontSize: mediumFontSize,
  },
  modalContent: {
    margin: 20,
    backgroundColor: whiteTwoColor,
  },
})

export default styles
