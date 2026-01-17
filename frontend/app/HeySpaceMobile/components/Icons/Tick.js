import React from 'react'
import {
  Svg,
  Path,
} from 'react-native-svg'
import PropTypes from 'prop-types'
import { whiteTwoColor } from 'common/commonStyles/colors'

Tick.propTypes = {
  color: PropTypes.string,
}

Tick.defaultProps = {
  color: whiteTwoColor,
}

export default function Tick(props) {
  return (
    <Svg style={props.style || { width: 18, height: 13 }} viewBox="0 0 18 13">
    	<Path d="M16 2l-9.625 9.625L2 7.25" fill="none" fillRule="evenodd" stroke={props.color} strokeLinecap="round" strokeWidth="2.5"/>
    </Svg>
  )
}
