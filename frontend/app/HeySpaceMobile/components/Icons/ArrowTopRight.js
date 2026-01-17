
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

export default function ArrowTopRight(props) {
  return (
    <Svg height="15" width="15" viewBox="0 0 15 15">
    	<G fill="currentColor" fillRule="nonzero" transform="rotate(-180 7.5 7.5)">
    		<Path d="M1.94 12.94c-.645-.645-.63-1.705.033-2.367l9.6-9.6c.662-.663 1.722-.678 2.366-.034.645.645.63 1.704-.033 2.367l-9.6 9.6c-.663.663-1.722.678-2.367.033l.001.001z"/>
    		<Rect height="10" width="3.2" rx="1.6" y="5"/>
    		<Rect height="10" width="3.2" rx="1.6" transform="rotate(90 5.2 13.4)" x="3.6" y="8.4"/>
    	</G>
    </Svg>
  );
}
