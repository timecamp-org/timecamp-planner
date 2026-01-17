import { StyleSheet } from 'react-native'

import { blueGreyColor } from 'common/commonStyles/colors'
import { gridCellSize, mediumFontSize, boldFontWeight } from 'styles/common'

const styles = StyleSheet.create({
  container: {
    marginVertical: gridCellSize * 2,
    paddingHorizontal: gridCellSize * 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamButton: {
    padding: gridCellSize,
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamTitle: {
    color: blueGreyColor,
    fontSize: mediumFontSize,
    fontWeight: boldFontWeight,
    marginLeft: 2 * gridCellSize,
  },
  plusIconWrapper: {
    width: gridCellSize * 5,
    height: gridCellSize * 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    borderRadius: gridCellSize * 3,
    backgroundColor: blueGreyColor,
  },
})

export default styles
