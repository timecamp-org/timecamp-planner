import { EntityType } from 'models/domain/EntityModel/types';
import MessageBoard from '../../../chat/MessageBoard';
import NoAccessContent from '../NoAccessContent';
import { BaseTileProps } from '../types';
import { useComponent } from './hook';
import styles from './styles.css';

const SpaceChatTile = (props: BaseTileProps) => {
  const hook = useComponent(props);

  if (!hook.hasAccessToView) {
    return <NoAccessContent viewId={props.viewId} />;
  }

  return (
    <MessageBoard
      objectId={props.spaceId}
      // @ts-ignore
      objectType={EntityType.PROJECT_DATA}
      shouldFocusOnMount={false}
      className={styles.messageBoard}
    />
  );
};

export default SpaceChatTile;
