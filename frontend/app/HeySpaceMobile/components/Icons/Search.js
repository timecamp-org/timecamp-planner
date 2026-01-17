import React from 'react'
import PropTypes from 'prop-types'
import { Svg, Path } from 'react-native-svg'
import { blueGreyColor } from '../../../common/commonStyles/colors'

Search.propTypes = {
  color: PropTypes.string,
  style: PropTypes.object,
}

Search.defaultProps = {
  color: blueGreyColor,
  style: {
    width: 16,
    height: 16,
  },
}

export default function Search(props) {
  return (
    <Svg style={props.style} viewBox="0 0 16 16">
    	<Path d="M15.56 15.56a1.503 1.503 0 0 1-2.125 0l-2.652-2.652a6.956 6.956 0 0 1-3.771 1.116 7.012 7.012 0 1 1 7.012-7.012c0 1.391-.417 2.68-1.116 3.771l2.652 2.652a1.502 1.502 0 0 1 0 2.125zM7.012 3.014a3.998 3.998 0 1 0 0 7.996 3.998 3.998 0 0 0 0-7.996z" fill={props.color} fillRule="nonzero"/>
    </Svg>
  )
}
