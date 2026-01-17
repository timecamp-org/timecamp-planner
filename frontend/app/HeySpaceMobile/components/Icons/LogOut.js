import React from 'react'
import { StyleSheet } from 'react-native'
import { Svg, G, Path } from 'react-native-svg'
import PropTypes from 'prop-types'
import { wisteriaColor } from 'common/commonStyles/colors'

LogOut.propTypes = {
  color: PropTypes.string,
  style: PropTypes.object,
}

LogOut.defaultProps = {
  color: wisteriaColor,
  style: {},
}

export default function LogOut(props) {
  return (
    <Svg style={StyleSheet.flatten([{ height: 18, width: 18 }, props.style])} viewBox="0 0 18 18">
    	<G fill="none" fillRule="evenodd" stroke={props.color} strokeLinecap="round" strokeWidth="2.5">
    		<Path d="M6.667 16H3.556C2.696 16 2 15.304 2 14.444V3.556C2 2.696 2.696 2 3.556 2h3.11M12.111 12.889L16 9l-3.889-3.889M16 9H6.667"/>
    	</G>
    </Svg>
  )
}
