import { StyleSheet } from 'react-native'
import { mediumFontSize, gridCellSize } from 'styles/common'
import { cloudyBlueColor } from 'common/commonStyles/colors'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4 * gridCellSize,
  },
  sectionTitle: {
    flexDirection: 'row',
    height: 4 * gridCellSize,
    alignItems: 'center',
    marginBottom: 2 * gridCellSize,
  },
  icon: {
    width: 5 * gridCellSize,
    height: 5 * gridCellSize,
    marginRight: 2 * gridCellSize,
  },
  sectionTitleText: {
    fontSize: mediumFontSize,
    color: cloudyBlueColor,
  },
  addItemButton: {
    marginTop: 0,
    alignItems: 'flex-start',
  },
  listWithButton: {
    paddingLeft: 7 * gridCellSize,
  },
})

export default styles
