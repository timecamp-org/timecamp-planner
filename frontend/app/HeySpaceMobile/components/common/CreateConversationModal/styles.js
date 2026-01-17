import { StyleSheet } from 'react-native'
import { darkGreyBlueColor, darkTwoColor, whiteColor, whiteTwoColor } from 'common/commonStyles/colors'
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
  searchInput: {
    marginVertical: 2 * gridCellSize,
    width: '100%',
    padding: 2 * gridCellSize,
    borderRadius: largeBorderRadius,
    borderWidth: 1,
    borderColor: whiteColor,
    backgroundColor: whiteTwoColor,
    color: darkTwoColor,
  },
  userListItem: {
    flexDirection: 'row',
    height: 10 * gridCellSize,
    alignItems: 'center',
  },
  userFullName: {
    marginLeft: 2 * gridCellSize,
    marginRight: 14 * gridCellSize,
    color: darkGreyBlueColor,
    fontSize: mediumFontSize,
  },
  radioButton: {
    marginLeft: 'auto',
  },
  submitButton: {
    marginTop: 4 * gridCellSize,
  },
})

export default styles
