import { StyleSheet } from 'react-native'

import { blueGreyColor, darkBlueGreyColor, duskColor } from 'common/commonStyles/colors'
import { gridCellSize, mediumFontSize, largeBorderRadius, smallerFontSize } from 'styles/common'

const disabledHint = {
  color: duskColor,
  fontSize: smallerFontSize,
  marginLeft: 2 * gridCellSize,
}

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 10,
    padding: gridCellSize * 1.5,
  },
  selectedButton: {
    backgroundColor: darkBlueGreyColor,
    borderRadius: largeBorderRadius,
  },
  buttonContent: {
    flex: 1,
    height: gridCellSize * 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  badge: {
    width: gridCellSize * 5,
    height: gridCellSize * 5,
    borderRadius: gridCellSize * 3,
    marginLeft: 'auto',
    backgroundColor: 'red',
  },
  conversationName: {
    marginLeft: 2 * gridCellSize,
    color: blueGreyColor,
    fontSize: mediumFontSize,
    marginRight: gridCellSize * 14,
  },
  personFullNameWithHint: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 60 * gridCellSize,
  },
  disabledHint,
  userHint: {
    ...disabledHint,
    color: duskColor,
  },
})

export default styles
