import { StyleSheet } from 'react-native'
import { dodgerBlueColor, cloudyBlueColor, blueGreyColor } from 'common/commonStyles/colors'
import { mediumFontSize, gridCellSize, boldFontWeight } from 'styles/common'

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
  uploadFilesWrapper: {
    flexDirection: 'row',
    paddingLeft: 4 * gridCellSize,
  },
  browseFilesButton: {

  },
  browseButtonText: {
    color: dodgerBlueColor,
    fontWeight: boldFontWeight,
    paddingLeft: 3 * gridCellSize,
  },
  browseText: {
    color: blueGreyColor,
    fontWeight: boldFontWeight,
  },
  sectionTitleText: {
    fontSize: mediumFontSize,
    color: cloudyBlueColor,
  },
  icon: {
    width: 5 * gridCellSize,
    height: 5 * gridCellSize,
    marginRight: 2 * gridCellSize,
  },
  attachments: {
    paddingVertical: 2 * gridCellSize,
  }
})

export default styles
