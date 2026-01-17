import React from 'react'
import PropTypes from 'prop-types'
import {
  Svg,
  G,
  Rect,
} from 'react-native-svg'
import { blueGreyColor } from 'common/commonStyles/colors'

ChevronLeft.propTypes = {
  color: PropTypes.string,
  style: PropTypes.object,
}

ChevronLeft.defaultProps = {
  color: blueGreyColor,
  style: {
    height: 10,
    width: 6,
  },
}

export default function ChevronLeft(props) {
  return (
    <Svg style={props.style} viewBox="0 0 6 10">
      <G fill={props.color} fill-rule="evenodd">
        <Rect width="2" height="7" x="2.682" y="3.722" rx="1" transform="rotate(135 3.682 7.222)"/>
        <Rect width="2" height="7" x="2.682" y=".182" rx="1" transform="rotate(-135 3.682 3.682)"/>
      </G>
    </Svg>
  )
}
