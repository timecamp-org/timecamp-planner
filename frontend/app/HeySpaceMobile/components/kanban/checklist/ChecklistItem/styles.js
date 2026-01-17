import { StyleSheet } from 'react-native'
import {
  silverColor,
} from 'common/commonStyles/colors'
import {
  gridCellSize,
  defaultBorderRadius,
} from 'styles/common'

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2 * gridCellSize,
  },
  checkbox: {
    marginRight: 2 * gridCellSize,
  },
  nameInputFocused: {
    flex: 1,
    paddingHorizontal: 2 * gridCellSize,
    paddingVertical: gridCellSize,
    borderWidth: 1,
    borderColor: silverColor,
    borderRadius: defaultBorderRadius,
  },
  nameInput: {
    flex: 1,
    paddingHorizontal: 2 * gridCellSize,
    paddingVertical: gridCellSize,
  },
  deleteButton: {
    padding: 2 * gridCellSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 5 * gridCellSize,
    height: 5 * gridCellSize,
  },
})

export default styles
