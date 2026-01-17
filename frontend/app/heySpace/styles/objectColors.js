import * as Colors from 'common/commonStyles/colors'
import objectColorStyles from './object-colors-styles.css'


export default class ObjectColors {

  static hexToColorNameMap = {
    [Colors.clearBlueColor]: 'clearBlueColor',
    [Colors.seafoamBlueColor]: 'seafoamBlueColor',
    [Colors.macaroniAndCheeseColor]: 'macaroniAndCheeseColor',
    [Colors.lipstickColor]: 'lipstickColor',
    [Colors.softPinkColor]: 'softPinkColor',
    [Colors.darkPeachColor]: 'darkPeachColor',
    [Colors.lightBlueColor]: 'lightBlueColor',
    [Colors.cornFlowerColor]: 'cornFlowerColor',
    [Colors.mediumPinkColor]: 'mediumPinkColor',
    [Colors.wisteriaColor]: 'wisteriaColor',
    [Colors.coralPinkColor]: 'coralPinkColor',
    [Colors.cloudyBlueColor]: 'cloudyBlueColor',
    [Colors.whiteFourColor]: 'whiteFourColor',
    [Colors.whiteTwoColor]: 'whiteTwoColor',
    [Colors.lightGreyColor]: 'lightGreyColor',
  }

  static getColorNameFromHex(hex) {
    const colorName = this.hexToColorNameMap[hex]
    return colorName || 'cloudyBlueColor'
  }

  static getColorSpecificClassName(color = 'cloudyBlueColor', componentName = '') {
    if (!(Object.keys(this.hexToColorNameMap).includes(color) || Object.values(this.hexToColorNameMap).includes(color))) {
      console.warn(`Cannot get class name for nonexistant color: ${color} for component: ${componentName}. Defaulting to cloudyBlueColor`)
      return objectColorStyles[`object-color-${componentName}-cloudyBlueColor`]
    }

    const isColorInHexFormat = color[0] === '#'
    if (isColorInHexFormat) {
      return objectColorStyles[`object-color-${componentName}-${this.getColorNameFromHex(color)}`]
    } else {
      return objectColorStyles[`object-color-${componentName}-${color}`]
    }
  }

}
