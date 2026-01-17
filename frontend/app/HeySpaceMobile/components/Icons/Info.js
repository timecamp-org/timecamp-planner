import React from 'react'
import PropTypes from 'prop-types'
import {
  Svg,
  Path,
} from 'react-native-svg'
import { brightBlueColor } from 'common/commonStyles/colors'

Info.propTypes = {
  style: PropTypes.object,
  color: PropTypes.string,
}

Info.defaultProps = {
  style: {
    width: 22,
    height: 22,
  },
  color: brightBlueColor,
}

export default function Info(props) {
  return (
    <Svg style={props.style} viewBox="0 0 22 22">
      <Path fill={props.color} fillRule="evenodd" d="M11 21c5.523 0 10-4.477 10-10S16.523 1 11 1 1 5.477 1 11s4.477 10 10 10zm0 1C4.925 22 0 17.075 0 11S4.925 0 11 0s11 4.925 11 11-4.925 11-11 11zm-.25-14.5a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zM9 17.5V17h1V9.5H9V9h3v8h1v.5H9z"/>
    </Svg>
  )
}
