import { Dimensions, Platform } from 'react-native'
import isIOS from './isIOS'

export function isIphoneX() {
  const dimen = Dimensions.get('window')
  return (
    isIOS &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    ((dimen.height === 812 || dimen.width === 812) || (dimen.height === 896 || dimen.width === 896))
  );
}

export const iphoneXTopMargin = 44
export const iphoneXBottomMargin = 34
export const iphoneXHeightMargin = iphoneXTopMargin + iphoneXBottomMargin
