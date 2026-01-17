import React from 'react'
import PropTypes from 'prop-types'
import { Svg, G, Path, Rect } from 'react-native-svg'
import { wisteriaColor } from '../../../common/commonStyles/colors'

Calendar.propTypes = {
  color: PropTypes.string,
  style: PropTypes.object,
}

Calendar.defaultProps = {
  color: wisteriaColor,
  style: {
    width: 17,
    height: 18,
  },
}

export default function Calendar(props) {
  return (
    <Svg style={props.style} viewBox="0 0 17 18">
    	<G fill="none" fillRule="evenodd" stroke={props.color} strokeLinecap="round" strokeWidth="2.4" transform="translate(2 2)">
    		<Rect height="13" width="13" rx="2" y="1"/>
    		<Path d="M9 0v2M4 0v2M0 5h13"/>
    	</G>
    </Svg>
  )
}
