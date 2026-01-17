
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

export default function AlertTriangle(props) {
  return (
    <Svg height="18" width="20" viewBox="0 0 20 18">
    	<G fill="none" fillRule="evenodd" transform="translate(2 2)">
    		<Path d="M6.69.737L.206 11.57a1.533 1.533 0 0 0 1.31 2.298h12.97a1.531 1.531 0 0 0 1.31-2.298L9.309.737a1.531 1.531 0 0 0-2.618 0zM8 5v3" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5"/>
    		<Circle x="7.853" y="10.853" fill="currentColor" r="1"/>
    	</G>
    </Svg>
  );
}
