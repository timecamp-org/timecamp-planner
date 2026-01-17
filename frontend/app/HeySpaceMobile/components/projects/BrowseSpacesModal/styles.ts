import { StyleSheet } from 'react-native'
import { darkGreyBlueColor, whiteTwoColor } from 'common/commonStyles/colors'
import { headingFontSize, mediumFontSize } from 'styles/common'


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
  sectionTitle: {
    fontSize: headingFontSize,
    color: darkGreyBlueColor,
  },
})

export default styles
