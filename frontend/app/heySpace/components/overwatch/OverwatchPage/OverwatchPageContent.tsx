import { Id } from 'common/utils/identifier';

import { List } from 'immutable';
import { FC } from 'react';
import AddSpaceToOverwatchViewButton from '../AddSpaceToOverwatchViewButton';
import OverwatchViewTile from '../tiles/OverwatchViewTile';
import OverwatchPlaceholder from './OverwatchPlaceholder';
import styles from './styles.css';

interface OverwatchPageContetnInterface {
  viewIds: List<Id>;
}

const OverwatchPageContent: FC<OverwatchPageContetnInterface> = ({ viewIds }) => {
  if (!viewIds.size) {
    return <OverwatchPlaceholder />;
  }

  return (
    <div className={styles.overwatchTiles}>
      {viewIds.map((viewId) => (
        <OverwatchViewTile key={viewId} viewId={viewId} />
      ))}
      <AddSpaceToOverwatchViewButton />
    </div>
  );
};

export default OverwatchPageContent;
