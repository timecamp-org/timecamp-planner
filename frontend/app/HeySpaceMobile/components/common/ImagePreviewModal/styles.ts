import { StyleSheet } from 'react-native'
import { gridCellSize } from '../../../styles/common'

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    alignItems: 'flex-end',
    padding: gridCellSize * 3,
  },
  icon: {
    width: gridCellSize * 4,
    height: gridCellSize * 4,
  }
})

export default styles