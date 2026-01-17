
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

export default function Info7(props) {
  return (
    <Svg height="18" width="18" viewBox="0 0 18 18">
    	<G fill="none" fillRule="evenodd" stroke="#7088A1" strokeLinecap="round" strokeWidth="2.5" transform="translate(2 2)">
    		<Circle x="7" y="7" r="7"/>
    		<Path d="M7 9.8V7M7 4v-.5"/>
    	</G>
    </Svg>
  );
}
