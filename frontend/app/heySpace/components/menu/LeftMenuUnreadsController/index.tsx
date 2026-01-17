import { FC, memo, useContext } from 'react';

import LeftMenuUnreads from '../LeftMenuUnreads/LeftMenuUnreads';

import { LeftMenuUnreadsContext } from './context';

export type LeftMenuUnreadsControllerInterface = {
  isUpgradeButtonVisible: boolean;
};

const LeftMenuUnreadsController: FC<LeftMenuUnreadsControllerInterface> = (props) => {
  const context = useContext(LeftMenuUnreadsContext);

  return (
    <>
      {context.hiddenTopBadge && (
        <LeftMenuUnreads
          position={'top'}
          isUpgradeButtonVisible={props.isUpgradeButtonVisible}
          onClick={context.hiddenTopBadge.onClick}
        />
      )}
      {context.hiddenBottomBadge && (
        <LeftMenuUnreads
          isUpgradeButtonVisible={props.isUpgradeButtonVisible}
          position={'bottom'}
          onClick={context.hiddenBottomBadge.onClick}
        />
      )}
    </>
  );
};

export default memo(LeftMenuUnreadsController);
