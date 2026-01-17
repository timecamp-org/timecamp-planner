import { StyleSheet } from 'react-native'
import { whiteTwoColor, wisteriaColor, darkGreyBlueColor, blueGreyColor } from 'common/commonStyles/colors'
import { mediumFontSize, mediumFontWeight } from 'styles/common'

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
  modalHeader: {
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: mediumFontSize,
    color: wisteriaColor,
    fontWeight: mediumFontWeight,
  },
  sectionTitle: {
    marginTop: 25,
    fontSize: mediumFontSize,
    color: darkGreyBlueColor,
  },
  privacySetting: {
    flexDirection: 'row',
    marginTop: 20,
  },
  privacySettingText: {
    fontSize: mediumFontSize,
    color: darkGreyBlueColor,
    marginLeft: 10,
  },
  privacySettingDescription: {
    fontSize: mediumFontSize,
    color: blueGreyColor,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
})

export default styles
