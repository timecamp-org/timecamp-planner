import { StyleSheet } from 'react-native'
import {
  blueGreyColor, cloudyBlueColor,
  coralPinkTwoColor, darkGreyBlueColor,
  lightGreyColor,
  whiteColor,
  whiteTwoColor
} from 'styles/colors'
import { boldFontWeight, largeBorderRadius, mediumFontSize, smallFontSize } from 'styles/common'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightGreyColor,
    padding: 10,
  },
  section: {
    padding: 10,
    borderRadius: largeBorderRadius,
    backgroundColor: whiteTwoColor,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: mediumFontSize,
    fontWeight: boldFontWeight,
    color: blueGreyColor,
    marginBottom: 20,
  },
  label: {
    color: darkGreyBlueColor,
    fontSize: mediumFontSize,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: whiteColor,
    borderRadius: largeBorderRadius,
    fontSize: mediumFontSize,
    padding: 10,
  },
  inputInvalid: {
    borderColor: coralPinkTwoColor,
  },
  validationWrapper: {
    height: 30,
  },
  validationMessage: {
    fontSize: smallFontSize,
    color: coralPinkTwoColor,
  },
  avatarSettingsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  avatarControls: {
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  buttonContent: {
    flexDirection: 'row',
  },
  icon: {
    width: 25,
    height: 25,
  },
  buttonText: {
    marginLeft: 15,
    fontSize: mediumFontSize,
    color: cloudyBlueColor,
  },
})

export default styles
