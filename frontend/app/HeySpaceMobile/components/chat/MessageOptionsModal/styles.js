import { StyleSheet } from 'react-native'
import {
  blueGreyColor,
  coralPinkTwoColor,
  whiteTwoColor,
} from 'common/commonStyles/colors'
import {
  defaultBorderRadius,
  mediumFontSize,
  gridCellSize,
} from '../../../styles/common'

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: whiteTwoColor,
    borderRadius: defaultBorderRadius,
    marginHorizontal: 2 * gridCellSize,
  },
  modalPadding: {
    padding: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 40,
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 20,
  },
  buttonText: {
    fontSize: mediumFontSize,
    color: blueGreyColor,
  },
  deleteButtonText: {
    color: coralPinkTwoColor,
  },
})

export default styles
