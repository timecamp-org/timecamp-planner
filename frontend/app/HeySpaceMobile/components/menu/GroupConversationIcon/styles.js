import { StyleSheet } from 'react-native'
import { whiteTwoColor, blueGreyColor } from 'common/commonStyles/colors'
import { microFontSize } from '../../../styles/common'
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: blueGreyColor,
  },
  left: {
    flex: 1,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  right: {
    flex: 1,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderLeftWidth: 1,
    borderLeftColor: whiteTwoColor,
  },
  rightAvatar: {
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsAvatar: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: blueGreyColor,
  },
  initials: {
    color: whiteTwoColor,
    fontSize: microFontSize,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: whiteTwoColor,
  },
})

export default styles
