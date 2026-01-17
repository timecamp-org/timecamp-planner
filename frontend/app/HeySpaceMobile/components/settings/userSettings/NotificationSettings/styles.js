import { StyleSheet } from 'react-native'
import {
  lightGreyColor,
  whiteTwoColor,
  blueGreyColor,
  iOSSettingsBackground,
  blackColor,
} from 'common/commonStyles/colors'
import { gridCellSize, mediumFontSize, boldFontWeight } from 'styles/common'

const styles = StyleSheet.create({
  iOSWrapper: {
    flex: 1,
    backgroundColor: iOSSettingsBackground,
  },
  loaderWrapper: {
    backgroundColor: lightGreyColor,
    height: '100%',
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: lightGreyColor,
    height: '100%',
  },
  settings: {
    backgroundColor: whiteTwoColor,
    display: 'flex',
    flexDirection: 'column',
    margin: 2 * gridCellSize,
    marginTop: 4 * gridCellSize,
    padding: 2 * gridCellSize,
    paddingTop: 3 * gridCellSize,
    paddingBottom: 3 * gridCellSize,
    borderRadius: 8,
  },
  header: {
    fontSize: mediumFontSize,
    fontWeight: boldFontWeight,
    color: blueGreyColor,
    marginBottom: (4 * gridCellSize),
  },
  inline: {
    display: 'flex',
    flexDirection: 'row',
  },
  switchTitle: {
    marginLeft: gridCellSize,
    marginTop: 2,
    fontSize: mediumFontSize,
    color: blackColor,
  },
  description: {
    marginTop: (2 * gridCellSize),
    marginLeft: (11 * gridCellSize),
    fontSize: mediumFontSize,
    marginBottom: (7 * gridCellSize),
  },
  bottomDescription: {
    marginBottom: 0,
  },
})

export default styles
