import { StyleSheet } from 'react-native'
import { gridCellSize } from 'styles/common'
import { brightBlueColor, brightRedColor } from '../../../../common/commonStyles/colors'

const styles = StyleSheet.create({
  attachment: {
    marginBottom: 4 * gridCellSize,
    width: '100%',
  },
  attachmentContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  attachmentUploadInfo: {
    flexDirection: 'row',
  },
  fileIcon: {
    width: 100,
    height: 100,
  },
  deleteButton: {
    marginLeft: 'auto',
  },
  deleteIcon: {
    width: 5 * gridCellSize,
    height: 5 * gridCellSize,
  },
  image: {
    maxWidth: '90%',
  },
  option: {
    color: brightBlueColor,
    fontSize: 20,
  },
  optionDestructive: {
    color: brightRedColor,
  },
})

export default styles
