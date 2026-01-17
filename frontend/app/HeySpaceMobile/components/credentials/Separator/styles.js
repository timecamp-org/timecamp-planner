import { StyleSheet } from 'react-native'

import { whiteColor, cloudyBlueColor } from 'common/commonStyles/colors'
import { gridCellSize } from 'styles/common'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 4 * gridCellSize,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 4 * gridCellSize,
    marginBottom: 4 * gridCellSize,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: whiteColor,
  },
  textElement: {
    color: cloudyBlueColor,
    marginLeft: 2 * gridCellSize,
    marginRight: 2 * gridCellSize,
  }
})

export default styles
