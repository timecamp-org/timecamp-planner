
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

export default function Clock(props) {
  return (
    <Svg height="18" width="18" viewBox="0 0 18 18">
    	<G fill="none" fillRule="evenodd" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" transform="translate(2 2)">
    		<Circle x="7" y="7" r="7"/>
    		<Path d="M7 3v4.5L10 9"/>
    	</G>
    </Svg>
  );
}
