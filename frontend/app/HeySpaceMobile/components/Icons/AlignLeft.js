
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

export default function AlignLeft(props) {
  return (
    <Svg height="16" width="17" viewBox="0 0 17 16">
    	<G fill="currentColor" fillRule="evenodd">
    		<Rect height="3.5" width="17" rx="1.75"/>
    		<Rect height="3.5" width="10" rx="1.75" y="6"/>
    		<Rect height="3.5" width="13" rx="1.75" y="12"/>
    	</G>
    </Svg>
  );
}
