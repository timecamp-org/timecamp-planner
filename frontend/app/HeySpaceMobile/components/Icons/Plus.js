import React from 'react'
import PropTypes from 'prop-types'
import { Svg, G, Path } from 'react-native-svg'

import { darkTwoColor } from 'common/commonStyles/colors'

Plus.propTypes = {
  color: PropTypes.string,
  style: PropTypes.object,
}

Plus.defaultProps = {
  color: darkTwoColor,
  style: {
    height: 18,
    width: 18,
  },
}

export default function Plus(props) {
  return (
    <Svg style={props.style} viewBox="0 0 17 16">
    	<G fill={props.color} fillRule="evenodd">
    		<Path d="M16.564 7.9c0 .828-.716 1.5-1.6 1.5h-12.8c-.884 0-1.6-.672-1.6-1.5s.716-1.5 1.6-1.5h12.8c.884 0 1.6.672 1.6 1.5z"/>
    		<Path d="M8.5 16c-.828 0-1.5-.716-1.5-1.6V1.6C7 .716 7.672 0 8.5 0S10 .716 10 1.6v12.8c0 .884-.672 1.6-1.5 1.6z"/>
    	</G>
    </Svg>
  )
}
