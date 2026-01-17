
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

export default function Happy(props) {
  return (
    <Svg height="18" width="18" viewBox="0 0 18 18">
    	<G fillRule="nonzero" transform="translate(1 1)">
    		<Path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14z" stroke="currentColor"/>
    		<Circle x="5.5" y="5.5" fill="currentColor" r="1"/>
    		<Circle x="10.5" y="5.5" fill="currentColor" r="1"/>
    		<Path d="M10.722 9a2.722 2.722 0 1 1-5.444 0H4.5a3.5 3.5 0 0 0 7 0h-.778z" stroke="currentColor"/>
    	</G>
    </Svg>
  );
}
