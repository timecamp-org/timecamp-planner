import { StyleSheet } from 'react-native'

import {
  wisteriaColor,
  whiteTwoColor,
  cloudyBlueColor,
  whiteThreeColor,
  blueGreyColor,
  darkGreyBlueColor,
  whiteColor,
} from 'common/commonStyles/colors'
import {
  largeBorderRadius,
  mediumFontSize,
  gridCellSize,
  largerFontSize,
  normalFontSize,
} from 'styles/common'

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    padding: 0,
    margin: 0,
  },
  component: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: whiteTwoColor,
  },
  header: {
    height: 12 * gridCellSize,
    backgroundColor: darkGreyBlueColor,
  },
  content: {
    flex: 1,
  },
  arrowLeftButton: {
    height: 12 * gridCellSize,
    width: 12 * gridCellSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowLeftIcon: {
    height: 6 * gridCellSize,
    width: 6 * gridCellSize,
  },
  input: {
    
  },
  userRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 2 * gridCellSize,
    paddingHorizontal: gridCellSize,
  },
  deleteIcon: {
    height: 4 * gridCellSize,
    width: 4 * gridCellSize,
  },
  userList: {
    flex: 1,
    padding: 2 * gridCellSize,
  },
  assigneeList: {
    flex: 1,
    padding: 2 * gridCellSize,
  },
  personIcon: {
    paddingRight: 2 * gridCellSize,
  },
  personFullName: {
    color: darkGreyBlueColor,
    fontSize: mediumFontSize,
  }
})

export default styles
