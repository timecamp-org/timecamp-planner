import { StyleSheet } from 'react-native'
import {
  blueGreyColor,
  coralPinkTwoColor,
  lightGreyColor,
  silverColor,
  whiteTwoColor,
} from 'common/commonStyles/colors'
import {
  boldFontWeight,
  defaultBorderRadius,
  headingFontSize,
  mediumFontSize,
  normalFontSize,
  gridCellSize,
} from 'styles/common'

const styles = StyleSheet.create({
  modalContainer: {
    marginHorizontal: 2 * gridCellSize,
    backgroundColor: whiteTwoColor,
    borderRadius: defaultBorderRadius,
  },
  modalPadding: {
    padding: 10,
  },
  buttonText: {
    fontSize: mediumFontSize,
    color: blueGreyColor,
  },
  deleteButtonText: {
    color: coralPinkTwoColor,
  },
  title: {
    fontSize: headingFontSize,
    fontWeight: boldFontWeight,
    marginBottom: 10,
  },
  description: {
    fontSize: normalFontSize,
    marginBottom: 10,
  },
  bottomButtonsWrapper: {
    height: 50,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: lightGreyColor,
    borderTopColor: silverColor,
    borderTopWidth: 1,
    borderBottomLeftRadius: defaultBorderRadius,
    borderBottomRightRadius: defaultBorderRadius,
  },
  deleteConfirmationButtonText: {
    fontSize: normalFontSize,
    color: blueGreyColor,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
})

export default styles
