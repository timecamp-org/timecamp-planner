
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

export default function ThreeDots(props) {
  return (
    <Svg height="4" width="20" viewBox="0 0 20 4">
    	<G fill="#000" fillRule="evenodd" opacity=".7">
    		<Circle x="2" y="2" r="2"/>
    		<Circle x="10" y="2" r="2"/>
    		<Circle x="18" y="2" r="2"/>
    	</G>
    </Svg>
  );
}
