import { StyleSheet } from 'react-native'

import { gridCellSize, defaultBorderRadius, mediumSmallFontSize } from '../../../styles/common'
import { black60Color } from 'common/commonStyles/colors'

export const emojiSize = 4 * gridCellSize

const styles = StyleSheet.create({
  component: {
    borderWidth: 1,
    paddingLeft: 3,
    paddingRight: 3,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: defaultBorderRadius,
    display: 'flex',
    alignItems: 'center',
    marginRight: gridCellSize,
    flexDirection: 'row',
  },
  emoji: {
    marginRight: 2,
  },
  usersCount: {
    fontSize: mediumSmallFontSize,
    color: black60Color,
    paddingRight: 1,
    paddingLeft: 3,
    height: 3 * gridCellSize,
    marginBottom: gridCellSize,
  },
})

export default styles
