
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

export default function ThreeDotsVertical(props) {
  return (
    <Svg height="15" width="3" viewBox="0 0 3 15">
    	<G fill="currentColor" fillRule="evenodd">
    		<Rect height="3" width="3" rx="1.5" y="12"/>
    		<Rect height="3" width="3" rx="1.5" y="6"/>
    		<Rect height="3" width="3" rx="1.5"/>
    	</G>
    </Svg>
  );
}
