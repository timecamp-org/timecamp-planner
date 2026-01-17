import { StyleSheet } from 'react-native'

import {
  blueGreyColor,
} from 'common/commonStyles/colors'
import {
  gridCellSize,
} from 'styles/common'

const styles = StyleSheet.create({
  component: {
    width: '100%',
    height: 12 * gridCellSize,
    alignItems: 'center',
    flexDirection: 'row',
    padding: 2 * gridCellSize,
  },
  label: {
    marginLeft: 2 * gridCellSize,
    color: blueGreyColor,
    flex: 1,
  },
  eyeIcon: {
    height: 3 * gridCellSize,
    width: 3 * gridCellSize,
  },
})

export default styles
