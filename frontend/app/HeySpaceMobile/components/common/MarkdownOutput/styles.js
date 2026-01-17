import { StyleSheet } from 'react-native'
import { whiteFourColor, lochmaraColor, cloudyBlueColor } from 'styles/colors'
import { gridCellSize, defaultBorderRadius, mediumFontSize, headingFontSize } from 'styles/common'

const styles = StyleSheet.create({
  paragraph: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  codeBlock: {
    backgroundColor: whiteFourColor,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: defaultBorderRadius,
    padding: 2 * gridCellSize,
    fontSize: mediumFontSize,
  },
  inlineCode: {
    backgroundColor: whiteFourColor,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: defaultBorderRadius,
    padding: gridCellSize,
    color: '#d72b3f',
    fontSize: mediumFontSize,
  },
  link: {
    color: lochmaraColor,
    textDecorationLine: 'underline',
  },
  text: {
    fontSize: mediumFontSize,
  },
  emoji: {
    fontSize: headingFontSize,
  },
  quoteWrapper: {
    borderLeftWidth: 3,
    borderLeftColor: cloudyBlueColor,
    paddingHorizontal: 2 * gridCellSize,
  },
  quote: { 
    opacity: 0.7,
  },
})

export default styles
