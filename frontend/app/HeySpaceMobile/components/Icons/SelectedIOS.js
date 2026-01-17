import React from 'react'
import PropTypes from 'prop-types'
import { Svg, Path, G, Circle } from 'react-native-svg'
import { blueGreyColor, brightBlueColor, lightGreyColor } from '../../../common/commonStyles/colors'

SelectedIOS.propTypes = {
  backgroundColor: PropTypes.string,
  tickColor: PropTypes.string,
  style: PropTypes.object,
}

SelectedIOS.defaultProps = {
  backgroundColor: brightBlueColor,
  tickColor: lightGreyColor,
  style: {
    width: 25,
    height: 25,
  },
}

export default function SelectedIOS(props) {
  return (
    <Svg style={props.style} viewBox="0 0 25 25">
      <G fill="none" fillRule="evenodd">
        <Circle cx="12.5" cy="12.5" r="12.5" fill={props.backgroundColor} />
        <Path stroke={props.tickColor} strokeLinecap="round" strokeLineJoin="round" strokeWidth="2" d="M20.455 7.955L9.517 18.892 4.545 13.92"/>
      </G>
    </Svg>
  )
}
