import { StyleSheet } from 'react-native'

import {
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
    alignItems: 'center',
    justifyContent: 'center',
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
  text: {
    fontSize: mediumFontSize,
    color: cloudyBlueColor,
    fontWeight: 'bold',
  },
})

export default styles
