import { StyleSheet } from 'react-native'
import { regularFontWeight, defaultFontFamily, defaultBorderRadius, boldFontWeight, mediumFontSize } from 'styles/common'
import { darkGreyBlueColor } from 'common/commonStyles/colors'

const styles = StyleSheet.create({
  Component: {
    fontWeight: regularFontWeight,
    fontFamily: defaultFontFamily,
    color: darkGreyBlueColor,
    borderRadius: defaultBorderRadius,
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userName: {
    // whiteSpace: 'nowrap',
    paddingLeft: 2,
    paddingRight: 3,
    fontSize: mediumFontSize,
  },
  taskName: {
    // whiteSpace: 'nowrap',
    paddingLeft: 2,
    fontSize: mediumFontSize,
  },
  projectName: {
    // whiteSpace: 'nowrap',
    paddingLeft: 2,
    fontSize: mediumFontSize,
  },
  notificationDetails: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  commentMessage: {
    // whiteSpace: 'pre-line',
    width: '100%',
    fontSize: mediumFontSize,
  },
  change: {
    paddingLeft: 2,
    paddingRight: 2,
    fontSize: mediumFontSize,
    display: 'flex',
    flexDirection: 'row',
    // flex: 1,
    flexWrap: 'nowrap',
  },
  textElement: {
    paddingLeft: 2,
    paddingRight: 2,
    fontWeight: regularFontWeight,
    fontSize: mediumFontSize,
  },
  textElementBold: {
    paddingLeft: 2,
    paddingRight: 2,
    fontWeight: boldFontWeight,
    fontSize: mediumFontSize,
  },
  comma: {
    paddingRight: 2,
  },
  date: {
    fontSize: mediumFontSize,
    display: 'flex',
    flexDirection: 'row',
  }
})

export default styles
