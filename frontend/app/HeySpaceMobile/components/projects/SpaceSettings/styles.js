import { StyleSheet } from 'react-native'
import {
  blueGreyColor, coralPinkTwoColor,
  darkGreyBlueColor,
  lightGreyColor,
  whiteColor,
  whiteTwoColor,
  cloudyBlueColor,
} from 'common/commonStyles/colors'
import { boldFontWeight, largeBorderRadius, mediumFontSize, smallFontSize, gridCellSize } from 'styles/common'


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightGreyColor,
    padding: gridCellSize * 2,
  },
  section: {
    padding: gridCellSize * 2,
    borderRadius: largeBorderRadius,
    backgroundColor: whiteTwoColor,
    marginBottom: gridCellSize * 2,
  },
  sectionTitle: {
    fontSize: mediumFontSize,
    fontWeight: boldFontWeight,
    color: blueGreyColor,
    marginBottom: gridCellSize * 4,
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
    padding: gridCellSize * 2,
  },
  inputInvalid: {
    borderColor: coralPinkTwoColor,
  },
  validationWrapper: {
    height: gridCellSize * 6,
  },
  validationMessage: {
    fontSize: smallFontSize,
    color: coralPinkTwoColor,
  },
  privacySetting: {
    flexDirection: 'row',
    marginTop: gridCellSize * 4,
  },
  privacySettingText: {
    fontSize: mediumFontSize,
    color: darkGreyBlueColor,
    marginLeft: gridCellSize * 2,
  },
  privacySettingDescription: {
    fontSize: mediumFontSize,
    color: blueGreyColor,
  },
  permissionWarn: {
    color: cloudyBlueColor,
    marginBottom: gridCellSize * 4,
  },
})

export default styles
