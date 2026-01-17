import { MouseEventHandler } from 'react';

import { DotsVertical } from 'commonComponents/Icons/fontawesome/DotsVertical';

import { WithColorInterface } from '../types';

interface RenderTargetInterface extends WithColorInterface {
  isActive: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  iconClassName: string;
}
export const Target = ({ iconClassName }: RenderTargetInterface) => <DotsVertical className={iconClassName} />;
