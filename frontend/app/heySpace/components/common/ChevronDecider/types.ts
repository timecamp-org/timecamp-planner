import { FigmaIconSizeProp } from 'app/heySpace/theme/types';

type ChevronDirection = 'up' | 'down' | 'left' | 'right';

export interface RenderChevronInterface {
  direction: ChevronDirection;
  size?: FigmaIconSizeProp;
}
