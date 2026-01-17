
import React from 'react';
import {
  Svg,
  Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Text,
  Use,
  Defs,
  Stop
} from 'react-native-svg';
import { wisteriaColor } from '../../../common/commonStyles/colors'

ArrowDown.defaultProps = {
  color: wisteriaColor,
  style: {
    width: 17,
    height: 18,
  },
}

export default function ArrowDown(props) {
  return (
    <Svg style={props.style} viewBox="0 0 18 18">
    	<G fill="none" fillRule="evenodd" stroke={props.color} strokeLinecap="round" strokeWidth="2.5">
    		<Path d="M9 2v14M16 9l-7 7-7-7"/>
    	</G>
    </Svg>
  );
}
