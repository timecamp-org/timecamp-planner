import { StyleSheet } from 'react-native'
import { cloudyBlueColor, lightGreyColor, whiteTwoColor, wisteriaColor } from 'common/commonStyles/colors'
import {
  boldFontWeight,
  largeBorderRadius,
  mediumFontSize,
} from 'styles/common'
import { iphoneXBottomMargin, isIphoneX } from '../../../utils/iphoneX'
import { gridCellSize } from '../../../styles/common'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightGreyColor,
  },
  tabNavigationIOS: {
    height: 10 * gridCellSize,
  },
  tabNavigationAndroid: {
    position: 'relative',
    height: 10 * gridCellSize,
    flexDirection: 'row',
    backgroundColor: whiteTwoColor,
    marginBottom: 2 * gridCellSize,
    // android shadow
    elevation: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemSelected: {
    color: wisteriaColor,
  },
  tabNavigationItem: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolbar: {
    marginBottom: 2 * gridCellSize,
    flexDirection: 'row',
    marginHorizontal: 3 * gridCellSize,
  },
  toolbarSection: {
    flexDirection: 'row',
    backgroundColor: whiteTwoColor,
    borderRadius: largeBorderRadius,
    paddingVertical: 2 * gridCellSize,
  },
  icon: {
    width: 6 * gridCellSize,
    height: 6 * gridCellSize,
    marginHorizontal: 2 * gridCellSize,
  },
  description: {
    flex: 1,
    padding: 2 * gridCellSize,
    marginHorizontal: 3 * gridCellSize,
    borderRadius: largeBorderRadius,
    backgroundColor: whiteTwoColor,
  },
  descriptionEditor: {
    flex: 1,
    textAlignVertical: 'top',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 3 * gridCellSize,
    paddingHorizontal: 4 * gridCellSize,
    paddingBottom: (isIphoneX() ? iphoneXBottomMargin : 3 * gridCellSize)
  },
  cancelButton: {
    height: 8 * gridCellSize,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2 * gridCellSize,
  },
  cancelButtonText: {
    color: cloudyBlueColor,
    fontSize: mediumFontSize,
    fontWeight: boldFontWeight,
  },
  saveButton: {
    width: 'auto',
    marginTop: 0,
    paddingHorizontal: 2 * gridCellSize,
  },
})

export default styles
