import React from 'react'
import { Svg, Path } from 'react-native-svg'
import PropTypes from 'prop-types'
import { wisteriaColor } from 'common/commonStyles/colors'

Trash.propTypes = {
  color: PropTypes.string,
  style: PropTypes.object,
}

Trash.defaultProps = {
  color: wisteriaColor,
  style: {
    width: 17,
    height: 18,
  },
}

export default function Trash(props) {
  return (
    <Svg style={props.style} viewBox="0 0 16 18">
    	<Path d="M2 4.8h12.133m-.933.747v9.146A1.32 1.32 0 0 1 11.867 16H5.2a1.32 1.32 0 0 1-1.333-1.307V5.547m2-.934V3.307A1.32 1.32 0 0 1 7.2 2h2.667A1.32 1.32 0 0 1 11.2 3.307v1.306" fill="none" fillRule="evenodd" stroke={props.color} strokeLinecap="round" strokeWidth="2.5"/>
    </Svg>
  )
}
