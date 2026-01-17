import { StyleSheet } from 'react-native'

import { whiteTwoColor, cloudyBlueColor } from 'styles/colors'
import {
  mediumFontSize,
  gridCellSize,
  largerFontSize,
} from 'styles/common'
import { iphoneXBottomMargin, isIphoneX } from '../../../utils/iphoneX'

const styles = StyleSheet.create({
  component: {
    flex: 1,
    backgroundColor: whiteTwoColor,
  },
  scrollContentWrapper: {
    marginBottom: (isIphoneX() ? iphoneXBottomMargin : 0),
  },
  loaderWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskInputStyles: {
    padding: 3 * gridCellSize,
    fontSize: largerFontSize,
  },
  taskNameWrapperStyles: {
    padding: 3 * gridCellSize,
  },
  taskNameTextStyles: {
    fontSize: largerFontSize,
    fontWeight: 'bold',
  },
  progressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2 * gridCellSize,
  },
  progressLabel: {
    color: cloudyBlueColor,
    fontSize: mediumFontSize,
    paddingHorizontal: 2 * gridCellSize,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  assigneesAndDueDate: {
    flexDirection: 'row',
    paddingHorizontal: 4 * gridCellSize,
    paddingVertical: 2 * gridCellSize,
  },
  usersAvatarsList: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  assigners: {
    marginRight: 'auto',
    height: 8 * gridCellSize,
  },
  dueDate: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsListWrapper: {
    paddingHorizontal: 4 * gridCellSize,
    paddingVertical: 2 * gridCellSize,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: gridCellSize,
  },
  assignUserIcon: {
    height: 4 * gridCellSize,
    width: 4 * gridCellSize,
  },
  icon: {
    height: 5 * gridCellSize,
    width: 5 * gridCellSize,
  },
  count: {
    backgroundColor: whiteTwoColor,
    height: 36,
    width: 36,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checklist: {
    paddingVertical: 2 * gridCellSize,
  },
})

export default styles
