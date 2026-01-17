import { StyleSheet } from 'react-native'

import {
  whiteTwoColor,
  darkGreyBlueColor,
  cloudyBlueColor,
  whiteColor,
  coralPinkTwoColor, darkTwoColor,
} from 'common/commonStyles/colors'
import {
  gridCellSize,
  mediumFontSize,
  normalFontSize,
  largeBorderRadius,
  smallFontSize,
} from 'styles/common'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // height: 21 * gridCellSize,
    backgroundColor: whiteTwoColor,
  },
  headers: {
    flexDirection: 'row',
    marginBottom: 2 * gridCellSize,
  },
  primaryHeaderText: {
    color: darkGreyBlueColor,
    fontSize: mediumFontSize,
  },
  secondaryHeaderText: {
    color: cloudyBlueColor,
    fontSize: normalFontSize,
    position: 'absolute',
    right: 0,
  },
  input: {
    width: '100%',
    // height: 10 * gridCellSize,
    position: 'relative',
  },
  textInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: whiteColor,
    borderRadius: largeBorderRadius,
    fontSize: mediumFontSize,
    padding: 2 * gridCellSize,
    color: darkTwoColor,
  },
  invalidInputStyle: {
    borderColor: coralPinkTwoColor,
  },
  validationMessage: {
    // position: 'absolute',
    // bottom: -4 * gridCellSize,
    fontSize: smallFontSize,
    color: coralPinkTwoColor,
  },
})

export default styles
