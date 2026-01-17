import { StyleSheet } from 'react-native'

import { whiteTwoColor } from 'common/commonStyles/colors'
import { gridCellSize } from '../../../styles/common'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: whiteTwoColor,
    position: 'relative'
  },
  virtualizedList: {
    minHeight: '100%',
    justifyContent: 'flex-end',
  },
  loadingMoreTitle: {
    height: gridCellSize * 10,
    width: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  beginningOfConversationTitle: {
    height: gridCellSize * 8,
    width: '100%',
    textAlignVertical: 'center',
    paddingLeft: gridCellSize * 2,
  },
  skeletonWrapper: {
    backgroundColor: whiteTwoColor,
    padding: gridCellSize * 5,
    position: 'absolute',
    width: '100%',
    height: '100%',
  }
})

export default styles
