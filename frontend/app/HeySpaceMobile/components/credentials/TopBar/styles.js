import { StyleSheet } from 'react-native'

import {
  whiteTwoColor,
  blueGreyColor,
  wisteriaColor,
} from 'common/commonStyles/colors'
import {
  mediumFontSize,
  gridCellSize,
  largeBorderRadius,
} from 'styles/common'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: whiteTwoColor,
  },
  topBar: {
    flexDirection: 'row',
    width: '100%',
    paddingTop: 3 * gridCellSize,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  topBarText: {
    flex: 1,
    textAlign: 'right',
    fontSize: mediumFontSize,
    color: blueGreyColor,
    marginRight: 3 * gridCellSize,
  },
  topBarButton: {
    height: 8 * gridCellSize,
    width: 21 * gridCellSize,
    color: wisteriaColor,
    borderColor: wisteriaColor,
    borderWidth: 2,
    borderRadius: largeBorderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 2 * gridCellSize,
  },
  topBarButtonText: {
    color: wisteriaColor,
    fontSize: mediumFontSize,
  },
})

export default styles
