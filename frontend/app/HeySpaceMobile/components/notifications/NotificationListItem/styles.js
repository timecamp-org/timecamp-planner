import { StyleSheet } from 'react-native'
import { wisteria15Color, whiteColor, cloudyBlueColor } from 'common/commonStyles/colors'
import { defaultFontFamily, gridCellSize, smallFontSize, fontFamilyTwo } from 'styles/common'

const styles = StyleSheet.create({
  Component: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    borderRadius: 2,
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: whiteColor,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    padding: 3 * gridCellSize,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    paddingLeft: 3 * gridCellSize,
    flex: 1,
  },
  unreadBackground: {
    backgroundColor: wisteria15Color,
  },
  dateWrapper: {
    display: 'flex',
    flexDirection: 'row',
    fontFamily: defaultFontFamily,
    color: cloudyBlueColor,
    fontSize: smallFontSize,
    paddingTop: gridCellSize,
    paddingRight: gridCellSize,
    paddingBottom: 0,
    paddingLeft: 0,
    alignItems: 'center',
    flex: 1,
  },
  date: {
    display: 'flex',
    flexDirection: 'row',
    paddingRight: 3,
    fontFamily: fontFamilyTwo,
    color: cloudyBlueColor,
    fontSize: smallFontSize,
  },
  time: {
    display: 'flex',
    flexDirection: 'row',
    paddingRight: 3,
    fontFamily: fontFamilyTwo,
    alignItems: 'flex-end',
    color: cloudyBlueColor,
    fontSize: smallFontSize,
  },
})

export default styles
