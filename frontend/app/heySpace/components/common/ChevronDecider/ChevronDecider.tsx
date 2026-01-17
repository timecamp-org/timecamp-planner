import { Box, BoxProps, SxProps } from '@mui/material';

import { FC } from 'react';
import { RenderChevronInterface } from './types';
import { renderChevron } from './utils/renderChevron';

interface ChevronDeciderInterface extends BoxProps, RenderChevronInterface {}

const chevronDeciderStyles: SxProps = {
  display: 'inline',
  color: 'var(--color-gray-900)',
  cursor: 'pointer',
};

const ChevronDecider: FC<ChevronDeciderInterface> = ({ direction = 'up', size = 'lg', ...props }) => {
  return (
    <Box sx={chevronDeciderStyles} {...props}>
      {renderChevron({ direction, size })}
    </Box>
  );
};

export default ChevronDecider;
