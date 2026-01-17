import { StyleSheet } from 'react-native'
import { whiteTwoColor, blueGreyColor, cloudyBlueColor } from 'common/commonStyles/colors'
import { gridCellSize, mediumFontSize } from '../../../styles/common'

export const messageLeftSize = gridCellSize * 11

const styles = StyleSheet.create({
  container: {
    backgroundColor: whiteTwoColor,
    display: 'flex',
    flexDirection: 'row',
    marginBottom: gridCellSize,
    marginTop: gridCellSize,
    marginRight: gridCellSize * 3,
  },
  left: {
    width: messageLeftSize,
    paddingTop: gridCellSize,
  },
  personIcon: {
    marginLeft: gridCellSize * 3,
  },
  right: {
    flex: 1,
  },
  messageInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  personName: {
    fontSize: mediumFontSize,
    color: blueGreyColor,
    marginRight: gridCellSize * 2,
  },
  messageTimestamp: {
    color: cloudyBlueColor,
  },
})

export default styles
