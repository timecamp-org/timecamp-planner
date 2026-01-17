
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

export default function AlertCircle(props) {
  return (
    <Svg height="20" width="20" viewBox="0 0 20 20">
    	<G fill="none" fillRule="evenodd" transform="translate(2 2)">
    		<G stroke="currentColor" strokeLinecap="round" strokeWidth="2.5">
    			<Circle x="8" y="8" r="8"/>
    			<Path d="M7.53 5v3.2"/>
    		</G>
    		<Ellipse x="7.529" y="11" fill="currentColor" rx="1" ry="1"/>
    	</G>
    </Svg>
  );
}
