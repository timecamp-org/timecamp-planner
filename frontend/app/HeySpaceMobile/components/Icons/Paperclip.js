import React from 'react'
import PropTypes from 'prop-types'
import { Svg, Path } from 'react-native-svg'

import { wisteriaColor } from 'common/commonStyles/colors'

Paperclip.propTypes = {
  color: PropTypes.string,
  style: PropTypes.object,
}

Paperclip.defaultProps = {
  color: wisteriaColor,
}

export default function Paperclip(props) {
  return (
    <Svg style={props.style || { width: 17, height: 18 }} viewBox="0 0 17 18">
    	<Path d="M15.81 8.362l-7.002 7.002A4.574 4.574 0 1 1 2.34 8.895l7.002-7.002a3.05 3.05 0 0 1 4.312 4.313l-7.01 7.001a1.525 1.525 0 1 1-2.156-2.156l6.469-6.46" fill="none" fillRule="evenodd" stroke={props.color} strokeLinecap="round" strokeWidth="2"/>
    </Svg>
  )
}
