import { StyleSheet } from 'react-native'

import { gridCellSize, largerBorderRadius, mediumFontSize, largeFontSize } from 'styles/common'
import { whiteTwoColor, darkGreyBlueColor, blackColor } from 'common/commonStyles/colors'

const styles = StyleSheet.create({
  component: {
    flex: 1,
  },
  list: {
    margin: gridCellSize * 2,
    padding: gridCellSize * 2,
    backgroundColor: whiteTwoColor,
    borderRadius: largerBorderRadius,
  },
  row: {
    flexDirection: 'row',
    position: 'relative',
    height: gridCellSize * 10,
    marginVertical: gridCellSize,
  },
  personDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: gridCellSize * 10,
  },
  personFullName: {
    marginLeft: gridCellSize * 2,
    color: darkGreyBlueColor,
    fontSize: mediumFontSize,
  },
  removeButton: {
    height: '100%',
    width: gridCellSize * 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeIcon: {
    height: gridCellSize * 4,
    width: gridCellSize * 4,
  },
  modal: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: whiteTwoColor,
    padding: gridCellSize * 4,
  },
  modalText: {
    fontSize: largeFontSize,
    color: blackColor,
  },
  modalButtons: {
    padding: gridCellSize * 2,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  modalButtonText: {
    padding: gridCellSize,
    fontSize: largeFontSize,
  },
  addUserToProjectModal: {
    position: 'absolute',
    right: gridCellSize * 4,
    bottom: gridCellSize * 4,
  },
  floatingActionButton: {
    height: gridCellSize * 11,
    width: gridCellSize * 11,
    borderRadius: gridCellSize * 11,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginRight: gridCellSize * 4,
    marginBottom: gridCellSize * 4,
  },
  plusIcon: {
    width: gridCellSize * 4,
    height: gridCellSize * 4,
  },
})

export default styles
