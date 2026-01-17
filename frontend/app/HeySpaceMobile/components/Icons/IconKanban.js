
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

export default function IconKanban(props) {
  return (
    <Svg height="17" width="22" viewBox="0 0 22 17">
    	<G fill="none" fillRule="evenodd" strokeWidth="2.5">
    		<Path d="M8 13.878C8 14.497 7.477 15 6.832 15H3.168C2.523 15 2 14.497 2 13.878V3.122C2 2.503 2.523 2 3.168 2h3.664C7.477 2 8 2.503 8 3.122v10.756zM20 12.05c0 .524-.523.95-1.168.95h-3.664c-.645 0-1.168-.426-1.168-.95v-9.1c0-.524.523-.95 1.168-.95h3.664c.645 0 1.168.426 1.168.95v9.1zM14 9.78c0 .673-.523 1.22-1.168 1.22H9.168C8.523 11 8 10.453 8 9.78V3.22C8 2.547 8.523 2 9.168 2h3.664C13.477 2 14 2.547 14 3.22v6.56z"/>
    	</G>
    </Svg>
  );
}
