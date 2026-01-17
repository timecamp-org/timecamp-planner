import { Placement } from '@popperjs/core';

import { UsePopperInterface } from './CardDetailsPopperContext';

export interface CardDetailsMoreOptionsInterface extends UsePopperInterface, WithColorInterface {
  targetClassName?: string;
  targetRenderer?: (onClick: React.MouseEventHandler) => JSX.Element;
  popperContentWrapperClassName?: string;
  popperPlacement?: Placement;
  iconClassName?: string;
}

export interface WithColorInterface {
  color?: string;
  onClosePopover?: () => void;
}
