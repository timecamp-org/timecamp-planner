import { StyleSheet } from 'react-native'
import {
  blueGreyColor,
  coralPinkTwoColor,
  lightGreyColor,
  whiteColor,
  whiteTwoColor,
  cloudyBlueColor,
} from 'common/commonStyles/colors'
import { boldFontWeight, largeBorderRadius, mediumFontSize, gridCellSize, deactivatedOpacity } from 'styles/common'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightGreyColor,
    padding: 10,
  },
  section: {
    padding: 10,
    marginBottom: 10,
    borderRadius: largeBorderRadius,
    backgroundColor: whiteTwoColor,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  sectionTitle: {
    fontSize: mediumFontSize,
    fontWeight: boldFontWeight,
    color: blueGreyColor,
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: whiteColor,
    borderRadius: largeBorderRadius,
    fontSize: mediumFontSize,
    paddingHorizontal: 10,
  },
  inputInvalid: {
    borderColor: coralPinkTwoColor,
  },
  inviteButton: {
    width: 80,
    marginLeft: 20,
    marginTop: 0,
  },
  userList: {
    flex: 1,
  },
  userLabel: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
  },
  userLabelRight: {
    marginLeft: 15,
    height: 40,
    justifyContent: 'space-around',
  },
  disabledUsersSwitcher: {
    marginTop: gridCellSize * 4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabledUsersText: {
    color: cloudyBlueColor,
    fontWeight: boldFontWeight,
  },
  chevronIcon: {
    marginLeft: gridCellSize * 2,
    color: cloudyBlueColor,
  },
  deactivated: {
    opacity: deactivatedOpacity,
  },
})

export default styles
