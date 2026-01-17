import { StyleSheet } from 'react-native'

import { blueGreyColor, cloudyBlueColor, darkTwoColor, whiteTwoColor } from 'common/commonStyles/colors'
import { boldFontWeight, largeBorderRadius, mediumFontSize, normalFontSize, gridCellSize } from 'styles/common'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: darkTwoColor,
  },
  divider: {
    marginHorizontal: gridCellSize * 2,
    marginVertical: gridCellSize * 4,
    height: 1,
    backgroundColor: blueGreyColor,
    opacity: 0.7,
  },
  workspaceButton: {
    marginHorizontal: gridCellSize * 6,
    paddingLeft: gridCellSize * 3,
  },
  workspaceName: {
    color: blueGreyColor,
    fontWeight: boldFontWeight,
    fontSize: mediumFontSize,
  },
  workspaceButtonSubtitle: {
    marginVertical: gridCellSize,
    color: cloudyBlueColor,
    fontSize: normalFontSize,
  },
  modalContent: {
    padding: gridCellSize * 4,
    borderRadius: largeBorderRadius,
    backgroundColor: whiteTwoColor,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: gridCellSize * 4,
  },
  button: {
    width: 'auto',
    flex: 1,
    height: gridCellSize * 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: largeBorderRadius,
    marginTop: 0,
  },
})

export default styles
