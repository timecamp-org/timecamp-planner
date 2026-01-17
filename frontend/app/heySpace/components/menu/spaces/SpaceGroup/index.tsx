import { FC, memo, useCallback } from 'react';

import { Droppable, DroppableProvided } from '@hello-pangea/dnd';

import { Id } from 'common/utils/identifier';
import Badge from 'commonComponents/Badge';
import { BadgeNotificationType } from 'commonComponents/Badge/types';
import { ChevronDown } from 'commonComponents/Icons/fontawesome/ChevronDown';
import { ChevronUp } from 'commonComponents/Icons/fontawesome/ChevronUp';
import { Edit } from 'commonComponents/Icons/fontawesome/Edit';
import { Trash } from 'commonComponents/Icons/fontawesome/Trash';
import PopoverContent from 'commonComponents/PopoverContent';
import StopClickEventPropagation from 'commonComponents/StopClickEventPropagation/component';
import UniversalPopover from 'commonComponents/UniversalPopover';
import UserInput from 'commonComponents/UserInput';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { useTranslation } from 'i18n';
import { TranslateFunction } from 'i18n/types';
import { List } from 'immutable';
import colors from 'styles/colors.css';
import { getConditionalClass } from 'utils/getConditionalClass';

import { GripDotsVertical } from '../../../common/Icons/fontawesome/GripDotsVertical';
import DraggableSpaceNavLink from '../DraggableSpaceNavLink';

import useComponent, { SpaceGroupHookInterface } from './hook';
import styles from './styles.css';

export type SpaceGroupInterface = {
  groupId: Id;
};

const popperModifiers = {
  offset: {
    offset: '0, 10',
  },
};

const SpaceGroup: FC<SpaceGroupInterface> = (props) => {
  const hook = useComponent(props);
  const { t } = useTranslation();

  return (
    <Droppable droppableId={props.groupId} type={'SPACE'}>
      {(provided, snapshot) => (
        <div
          className={snapshot.isDraggingOver ? styles.spaceGroupDraggingOver : styles.spaceGroup}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {hook.isInputOpen ? renderInput(hook, t) : renderDraggableRow(hook, props, t)}
          {hook.isExpanded && renderGroupSpaces(hook, provided)}
        </div>
      )}
    </Droppable>
  );
};

function renderDraggableRow(hook: SpaceGroupHookInterface, props: SpaceGroupInterface, t: TranslateFunction) {
  return (
    <div className={styles.draggableRow}>
      <GripDotsVertical className={styles.moveIcon} />
      <div className={styles.hoverableRow}>
        <SecondaryButton
          className={styles.button}
          color={colors.blueGreyColor}
          shouldChangeColorOnHover={false}
          onClick={hook.onToggleExpand}
        >
          <span className={styles.expandIcon}>{hook.isExpanded ? <ChevronUp /> : <ChevronDown size="lg" />}</span>
          <span className={hook.groupHasUnreadMessages ? styles.unreadMessagesGroupName : styles.groupName}>
            {hook.name}
          </span>
          <Badge objectId={props.groupId} objectType={BadgeNotificationType.PROJECT_GROUP} className={styles.badge} />
          {!hook.groupHasUnreadMessages && renderGroupOptionsWithPopover(hook, t)}
        </SecondaryButton>
      </div>
    </div>
  );
}

function renderInput(hook: SpaceGroupHookInterface, t: TranslateFunction) {
  return (
    <UserInput
      autoFocus
      placeholder={t('Enter folder name...')}
      innerClassName={styles.input}
      onChange={hook.onChangeGroupName}
      onBlur={hook.onSaveGroupName}
      onKeyDown={hook.onInputKeyDown}
      value={hook.localGroupName}
    />
  );
}

function renderGroupOptionsWithPopover(hook: SpaceGroupHookInterface, t: TranslateFunction) {
  return (
    <UniversalPopover
      isPopoverOpened={hook.isOptionsOpen}
      popperPlacement={'right'}
      popperModifiers={popperModifiers}
      targetClassName={`${styles.groupOptionsButtonWrapper} ${getConditionalClass(styles.active, hook.isOptionsOpen)}`}
      targetComponent={
        <div className={styles.groupOptionsButton} onClick={hook.onToggleIsOptionsOpen}>
          <Edit />
        </div>
      }
      popperComponent={renderGroupOptions(hook, t)}
    />
  );
}

function renderGroupOptions(hook: SpaceGroupHookInterface, t: TranslateFunction) {
  return (
    <PopoverContent isVisible={hook.isOptionsOpen} onClickOutside={hook.onCloseOptions}>
      <StopClickEventPropagation>
        <div className={styles.groupOptions}>
          <SecondaryButton
            className={styles.popoverButton}
            color={colors.blueGreyColor}
            onClick={hook.onOpenGroupInput}
          >
            <Edit className={styles.popoverIcon} />
            {t('Rename')}
          </SecondaryButton>
          <SecondaryButton className={styles.popoverButton} onClick={hook.onDeleteGroup}>
            <Trash className={styles.popoverIcon} />
            {t('Ungroup')}
          </SecondaryButton>
        </div>
      </StopClickEventPropagation>
    </PopoverContent>
  );
}

function renderGroupSpaces(hook: SpaceGroupHookInterface, provided: DroppableProvided) {
  return (
    <div className={styles.spaceLinks}>
      <InnerList spaceIds={hook.spaceIds} isSelected={hook.isSelected} />
      {provided.placeholder}
    </div>
  );
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
        className={styles.row}
        isSelected={props.isSelected(spaceId)}
        nameMaxLength={20}
      />
    ),
    [props.isSelected],
  );

  return <>{props.spaceIds.map(renderSpaceLink)}</>;
});

export default SpaceGroup;
