import React from 'react'
import PropTypes from 'prop-types'
import { Svg, G, Rect } from 'react-native-svg'
import { wisteriaColor } from 'common/commonStyles/colors'

Description.propTypes = {
  color: PropTypes.string,
  style: PropTypes.object,
}

Description.defaultProps = {
  color: wisteriaColor,
  style: {
    height: 15,
    width: 18,
  },
}

export default function Description(props) {
  return (
    <Svg style={props.style} viewBox="0 0 18 15">
    	<G fill={props.color} fillRule="evenodd">
    		<Rect height="2.5" width="13" rx="1.25"/>
    		<Rect height="2.5" width="18" rx="1.25" y="4"/>
    		<Rect height="2.5" width="10" rx="1.25" y="8"/>
    		<Rect height="2.5" width="14" rx="1.25" y="12"/>
    	</G>
    </Svg>
  )
}
