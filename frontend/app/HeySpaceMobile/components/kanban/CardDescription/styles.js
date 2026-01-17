import { StyleSheet } from 'react-native'
import { defaultBorderRadius, gridCellSize, mediumFontSize } from 'styles/common'
import { cloudyBlueColor, whiteColor } from 'common/commonStyles/colors'

const styles = StyleSheet.create({
  descriptionSection: {
    margin: 4 * gridCellSize,
  },
  descriptionWrapper: {
    padding: 2 * gridCellSize,
    borderWidth: 1,
    borderRadius: defaultBorderRadius,
    borderColor: whiteColor,
  },
  sectionTitle: {
    flexDirection: 'row',
    height: 4 * gridCellSize,
    alignItems: 'center',
    marginBottom: 2 * gridCellSize,
  },
  icon: {
    width: 4 * gridCellSize,
    height: 4 * gridCellSize,
    marginRight: 2 * gridCellSize,
  },
  sectionTitleText: {
    fontSize: mediumFontSize,
    color: cloudyBlueColor,
  },
})

export default styles
