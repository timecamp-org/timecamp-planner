import { StyleSheet } from 'react-native'
import {
  darkGreyBlueColor,
  whiteTwoColor,
  whiteColor, alertSuccessFontColor, coralPinkTwoColor, darkTwoColor
} from 'common/commonStyles/colors'
import { gridCellSize, largeBorderRadius, mediumFontSize } from 'styles/common'

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    margin: 0,
  },
  modalContent: {
    margin: 20,
    flex: 1,
    backgroundColor: whiteTwoColor,
  },
  top: {
    width: '100%',
    flexDirection: 'row',
  },
  title: {
    fontSize: mediumFontSize,
    color: darkGreyBlueColor,
  },
  closeIcon: {
    marginLeft: 'auto',
  },
  input: {
    marginTop: 10,
    width: '100%',
    padding: 2 * gridCellSize,
    borderRadius: largeBorderRadius,
    borderWidth: 1,
    borderColor: whiteColor,
    backgroundColor: whiteTwoColor,
    color: darkTwoColor,
  },
  infoContainer: {
    height: 30,
    justifyContent: 'center',
  },
  successInfo: {
    color: alertSuccessFontColor,
  },
  errorInfo: {
    color: coralPinkTwoColor,
  },
  button: {
    marginTop: 0,
  },
})

export default styles
