
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

export default function Follow(props) {
  return (
    <Svg height="34" width="34" viewBox="0 0 34 34">
    	<G fill="none" fillRule="evenodd" transform="translate(1 1)">
    		<Circle x="16" y="16" fill="#FFF" r="16" strokeOpacity=".6"/>
    		<G opacity=".7" strokeLinecap="round" transform="translate(8 10)">
    			<Path d="M0 5.818S2.91 0 8 0s8 5.818 8 5.818-2.91 5.818-8 5.818-8-5.818-8-5.818z"/>
    			<Circle x="8" y="5.818" r="2.182"/>
    		</G>
    	</G>
    </Svg>
  );
}
