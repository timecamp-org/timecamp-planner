import React from 'react'
import { Svg, G, Path } from 'react-native-svg'
import PropTypes from 'prop-types'
import { wisteriaColor } from 'common/commonStyles/colors'
import Trash from './Trash'

CornerUpRight.propTypes = {
  color: PropTypes.string,
  style: PropTypes.object,
}

CornerUpRight.defaultProps = {
  color: wisteriaColor,
  style: {
    width: 20,
    height: 20,
  },
}

export default function CornerUpRight(props) {
  return (
    <Svg style={props.style} viewBox="0 0 20 20">
    	<G fill="none" fillRule="evenodd">
    		<G stroke={props.color} strokeLinecap="round" strokeWidth="2.5">
    			<Path d="M13 12l5-5-5-5"/>
    			<Path d="M2 18v-7a4 4 0 0 1 4-4h12"/>
    		</G>
    	</G>
    </Svg>
  )
}
