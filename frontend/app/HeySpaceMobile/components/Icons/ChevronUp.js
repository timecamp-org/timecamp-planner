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
      <G stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <G transform="translate(5.500000, 3.500000) rotate(-90.000000) translate(-5.500000, -3.500000) translate(2.000000, -2.000000)" fill={props.color}>
          <Rect transform="translate(3.682000, 7.222000) rotate(135.000000) translate(-3.682000, -7.222000) " x="2.682" y="3.722" width="2" height="7" rx="1" />
          <Rect transform="translate(3.682000, 3.682000) rotate(-135.000000) translate(-3.682000, -3.682000) " x="2.682" y="0.182" width="2" height="7" rx="1" />
        </G>
      </G>
    </Svg>
  )
}
