import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { Svg, G, Path } from 'react-native-svg'
import { wisteriaColor } from 'common/commonStyles/colors'

File.propTypes = {
  style: PropTypes.object,
  color: PropTypes.string,
}

File.defaultProps = {
  style: {},
  color: wisteriaColor,
}

export default function File(props) {
  return (
    <Svg style={StyleSheet.flatten([{ height: 20, width: 17 }, props.style])} viewBox="0 0 17 20">
    	<G fill="none" fillRule="evenodd" stroke={props.color} strokeLinecap="round" strokeWidth="2.5">
    		<Path d="M9.2 2H3.6A1.6 1.6 0 0 0 2 3.6v12.8A1.6 1.6 0 0 0 3.6 18h9.6a1.6 1.6 0 0 0 1.6-1.6V7.6L9.2 2z"/>
    		<Path d="M9.2 2v5.6h5.6"/>
    	</G>
    </Svg>
  )
}
