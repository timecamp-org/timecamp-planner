import { StyleSheet } from 'react-native'

import { gridCellSize, mediumFontSize } from 'styles/common'
import { darkGreyBlueColor } from 'common/commonStyles/colors'

const styles = StyleSheet.create({
  component: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    position: 'relative',
    height: gridCellSize * 10,
    marginVertical: gridCellSize,
  },
  input: {
    padding: gridCellSize * 2,
    margin: gridCellSize * 2,
  },
  list: {
    padding: gridCellSize * 2,
  },
  row: {
    flex: 1,
    height: gridCellSize * 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowText: {
    marginLeft: gridCellSize * 2,
    color: darkGreyBlueColor,
    fontSize: mediumFontSize,
  },
})

export default styles
