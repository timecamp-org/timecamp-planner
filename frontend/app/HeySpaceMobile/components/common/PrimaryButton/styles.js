import { StyleSheet } from 'react-native'

import {
  wisteriaColor,
  whiteTwoColor,
  cloudyBlueColor,
} from 'common/commonStyles/colors'
import {
  largeBorderRadius,
  mediumFontSize,
  gridCellSize,
} from 'styles/common'

const styles = StyleSheet.create({
  component: {
    width: '100%',
    height: 40,
    backgroundColor: wisteriaColor,
    color: whiteTwoColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: largeBorderRadius,
    marginTop: 6 * gridCellSize,
  },
  disabled: {
    width: '100%',
    height: 40,
    backgroundColor: cloudyBlueColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: largeBorderRadius,
  },
  textElement: {
    fontSize: mediumFontSize,
    color: whiteTwoColor,
    fontWeight: 'bold',
  },
})

export default styles
