
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

export default function CheckCircle(props) {
  return (
    <Svg height="20" width="20" viewBox="0 0 20 20">
    	<G fill="none" fillRule="evenodd" stroke="currentColor" strokeWidth="2.5" transform="translate(2 2)">
    		<Path d="M4.706 7l2.867 3 2.867-3" strokeLinecap="round"/>
    		<Circle x="8" y="8" r="8"/>
    	</G>
    </Svg>
  );
}
