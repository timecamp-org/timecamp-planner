import { StyleSheet } from 'react-native'
import { gridCellSize } from '../../../styles/common'
import { brightBlueColor } from 'common/commonStyles/colors'

const styles = StyleSheet.create({
  option: {
    color: brightBlueColor,
    fontSize: 20,
  },
  icons: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 2 * gridCellSize,
  },
  button: {
    marginRight: gridCellSize,
    padding: gridCellSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 5 * gridCellSize,
    width: 5 * gridCellSize,
  },
})

export default styles
