import { IconButton } from '@mui/material';
import { FigmaIconSizeProp } from 'app/heySpace/theme/types';
import { FlagSwallowTailLight } from 'commonComponents/Icons/fontawesome/FlagSwallowTailLight';
import { FlagSwallowTailSolid } from 'commonComponents/Icons/fontawesome/FlagSwallowTailSolid';
import { TASK_PRIORITY_FLAG_BUTTON_PADDING_BY_SIZE } from './const';
import styled from 'styles/styled';

export const TaskPriorityFlagButton = styled(IconButton)<{
  $flagSize: FigmaIconSizeProp;
  $hideBorder?: boolean;
  $isCrossed?: boolean;
}>`
  border-radius: 50%;
  ${({ $hideBorder }) => !$hideBorder && 'border: 1px dashed var(--color-gray-500);'}
  display: flex;
  justify-content: center;
  align-items: center;
  width: unset;
  height: unset;
  padding: ${({ $flagSize }) => TASK_PRIORITY_FLAG_BUTTON_PADDING_BY_SIZE[$flagSize]}px;
  &:hover {
    background-color: var(--color-gray-200);
  }

  ${({ $isCrossed }) =>
    $isCrossed &&
    `
  overflow: hidden;
  position: relative;
  &:after {
    position: absolute;
    content: '';
    height: 2px;
    width: 200%;
    background-color: var(--color-gray-400);
    left: 0;
    top: 0;
    transform: translate(0, 50%) rotate(45deg);
    transform-origin: left;
  }`}
`;

export const TaskPriorityFlagLight = styled(FlagSwallowTailLight)<{
  $flagSize: FigmaIconSizeProp;
  grayscale?: boolean;
}>`
  font-size: var(--fontSize-${({ $flagSize }) => $flagSize || 'xs'});
  color: var(--color-gray-500);
`;

export const TaskPriorityFlagSolid = styled(FlagSwallowTailSolid)<{ $flagSize: FigmaIconSizeProp }>`
  font-size: var(--fontSize-${({ $flagSize }) => $flagSize || 'xs'});
`;
