
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

export default function Arrow(props) {
  return (
    <Svg height="35" width="46" viewBox="0 0 46 35">
    	<G fill="none" fillRule="evenodd" transform="rotate(-180 23 17.5)">
    		<Path d="M17.94 22.94c-.645-.645-.63-1.705.033-2.367l9.6-9.6c.662-.663 1.722-.678 2.366-.034.645.645.63 1.704-.033 2.367l-9.6 9.6c-.663.663-1.722.678-2.367.033z" fill="currentColor"/>
    		<Rect height="10" width="3.2" fill="currentColor" rx="1.6" x="16" y="15"/>
    		<Rect height="10" width="3.2" fill="currentColor" rx="1.6" transform="rotate(90 21.2 23.4)" x="19.6" y="18.4"/>
    	</G>
    </Svg>
  );
}
