import { StyleSheet } from 'react-native'
import { gridCellSize } from 'styles/common'
import { brightBlueColor, brightRedColor } from 'common/commonStyles/colors'

const styles = StyleSheet.create({
  component: {
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
  },
  fileIcon: {
    width: 4 * gridCellSize,
    height: 4 * gridCellSize,
    marginRight: 2 * gridCellSize,
  },
  option: {
    color: brightBlueColor,
    fontSize: 20,
  },
  optionDestructive: {
    color: brightRedColor,
  },
  name: {
    flex: 1,
  }
})

export default styles
