import { StyleSheet } from 'react-native'

import {
  whiteTwoColor,
  blackColor,
  whiteColor,
  brightBlueColor,
  cloudyBlueColor,
  steelColor,
  darkTwoColor
} from 'common/commonStyles/colors'
import {
  gridCellSize,
  normalFontSize,
  largeFontSize,
  headingFontSize,
} from 'styles/common'

const styles = StyleSheet.create({
  modal: {
    padding: 0,
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  component: {
    backgroundColor: whiteColor,
    width: 54 * gridCellSize,
    borderRadius: 14,
  },
  header: {
    marginTop: 7 * gridCellSize,
    fontSize: headingFontSize,
    color: blackColor,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: normalFontSize,
  },
  content: {
    justifyContent: 'center',
  },
  textInput: {
    width: 48 * gridCellSize,
    marginLeft: 3 * gridCellSize,
    maxHeight: 21 * gridCellSize,
    marginTop: 5 * gridCellSize,
    marginBottom: 2 * gridCellSize,
    backgroundColor: whiteTwoColor,
    borderWidth: 1,
    borderColor: steelColor,
    padding: 3,
    color: darkTwoColor,
  },
  footer: {
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginTop: 2 * gridCellSize,
  },
  footerButton: {
    width: '50%',
    justifyContent: 'center',
    borderColor: cloudyBlueColor,
    borderTopWidth: 1,
  },
  footerButtonText: {
    padding: gridCellSize,
    paddingBottom: 3 * gridCellSize,
    paddingTop: 3 * gridCellSize,
    fontSize: largeFontSize,
    textAlign: 'center',
    color: brightBlueColor,
  },
  leftButton: {
    borderRightWidth: 1,
  }
})

export const pickerStyles = {
  inputIOS: {
    width: 48 * gridCellSize,
    marginLeft: 3 * gridCellSize,
    maxHeight: 21 * gridCellSize,
    marginTop: 5 * gridCellSize,
    marginBottom: 2 * gridCellSize,
    backgroundColor: whiteTwoColor,
    borderWidth: 1,
    borderColor: steelColor,
    padding: 3,
    color: blackColor,
  },
}

export default styles
