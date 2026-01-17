import { FC, memo, useCallback } from 'react';

import { List } from 'immutable';
import { Droppable } from '@hello-pangea/dnd';

import { Id } from 'common/utils/identifier';
import { useTranslation } from 'i18n';
import { ProjectDroppableType } from 'models/domain/PersonalProjectStructureModel/types';

import DraggableSpaceNavLink from '../DraggableSpaceNavLink';

import useComponent, { UngroupedSpaceNavLinksHookInterface } from './hook';
import styles from './styles.css';

const UngroupedSpaceNavLinks = () => {
  const { t } = useTranslation();
  const hook = useComponent();

  return (
    <div className={styles.Component}>
      {hook.isEmptySpacesVisible && renderNoSpacesHint(t)}
      {hook.isRequestFinished && renderUngroupedSpaces(hook)}
    </div>
  );
};

function renderUngroupedSpaces(hook: UngroupedSpaceNavLinksHookInterface) {
  return (
    <Droppable droppableId={ProjectDroppableType.LOOSE} type={'SPACE'}>
      {(provided) => (
        <div className={styles.ungroupedSpaces} ref={provided.innerRef} {...provided.droppableProps}>
          <InnerList spaceIds={hook.spaceIds} isSelected={hook.isSelected} />
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

function renderNoSpacesHint(t) {
  return <span className={styles.noSpacesHint}>{t(`You don't belong to any project yet`)}</span>;
}

type InnerListInterface = {
  spaceIds: List<Id>;
  isSelected: (spaceId: Id) => boolean;
};

const InnerList: FC<InnerListInterface> = memo((props) => {
  const renderSpaceLink = useCallback(
    (spaceId: Id, index: number) => (
      <DraggableSpaceNavLink
        spaceId={spaceId}
        index={index}
        key={`draggable_${spaceId}`}
        isSelected={props.isSelected(spaceId)}
      />
    ),
    [props.isSelected]
  );

  return <>{props.spaceIds.map(renderSpaceLink)}</>;
});

export default UngroupedSpaceNavLinks;
