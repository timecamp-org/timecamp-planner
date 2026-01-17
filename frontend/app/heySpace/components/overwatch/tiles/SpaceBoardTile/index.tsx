import SectionList from '../../../taskList/SectionList';
import NoAccessContent from '../NoAccessContent';
import { BaseTileProps } from '../types';
import { useComponent } from './hook';
import styles from './styles.css';

const SpaceBoardTile = (props: BaseTileProps) => {
  const hook = useComponent(props);

  if (!hook.hasAccessToView) {
    return <NoAccessContent viewId={props.viewId} />;
  }

  return (
    <SectionList
      projectId={props.spaceId}
      isKanban={true}
      isVirtual={true}
      // @ts-ignore
      className={styles.kanban}
      innerClassName={styles.horizontal}
      sectionClassName={styles.section}
      shouldRenderAddSectionButton={true}
    />
  );
};

export default SpaceBoardTile;
