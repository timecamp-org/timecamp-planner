import { memo, useRef } from 'react';

import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import { Plus } from 'commonComponents/Icons/fontawesome/Plus';
import CardInput from 'components/tasks/CardInput';
import { useTranslation } from 'i18n';

import DraggableSectionListItem from '../DraggableSectionListItem';
import TaskList from '../TaskList';
import VirtualizedTaskList from '../TaskList/virtualized';

import styles from './styles.css';

Section.propTypes = {
  className: PropTypes.string,
  isMyTaskList: PropTypes.bool,

  isDraggable: PropTypes.bool,
  isKanban: PropTypes.bool,
  isVirtual: PropTypes.bool,

  onSetListWrapperRef: PropTypes.func,
  onScrollListWrapperToBottom: PropTypes.func,

  isLastCardInputVisible: PropTypes.bool,
  onShowLastCardInput: PropTypes.func,
  onHideLastCardInput: PropTypes.func,
  onCreateLastCardDispatched: PropTypes.func,

  isFirstCardInputVisible: PropTypes.bool,
  onShowFirstCardInput: PropTypes.func,
  onHideFirstCardInput: PropTypes.func,
  onCreateFirstCardDispatched: PropTypes.func,
  onWorkspaceDoubleClick: PropTypes.func,
};

Section.defaultProps = {
  isDraggable: true,
  isKanban: false,
  isMyTaskList: false,
  isVirtual: false,

  isSectionInputFocused: false,

  onSetListWrapperRef: doNothing,
  onScrollListWrapperToBottom: doNothing,

  isLastCardInputVisible: false,
  onShowLastCardInput: doNothing,
  onHideLastCardInput: doNothing,
  onCreateLastCardDispatched: doNothing,

  isFirstCardInputVisible: false,
  onShowFirstCardInput: doNothing,
  onHideFirstCardInput: doNothing,
  onCreateFirstCardDispatched: doNothing,
  onDoubleClick: doNothing,
};

function Section(props) {
  const { t } = useTranslation();
  const virtualizedTaskListRef = useRef();

  const onSetVirtualizedTaskListRef = (ref) => (virtualizedTaskListRef.current = ref);

  const scrollToBottom = () => {
    setTimeout(() => {
      virtualizedTaskListRef.current.scrollToRow(-1);
    }, 0);
    setTimeout(() => {
      virtualizedTaskListRef.current.scrollToRow(props.taskIds.size);
    }, 100);
  };

  return (
    <div
      key={`draggableSection_${props.sectionId}`}
      className={props.isKanban ? styles.kanbanColumn : undefined}
      onDoubleClick={props.onDoubleClick}
    >
      <DraggableSectionListItem
        className={props.className}
        wrapperClassName={
          props.isSectionLastCardInputVisible &&
          `${props.isKanban ? styles.listWrapperLongKanban : styles.listWrapperLong}`
        }
        sectionId={props.sectionId}
        index={props.index}
        userId={props.userId}
        sectionOptions={props.sectionOptions}
        shouldRenderProjectIcon={props.isMyTaskList}
        renderFooter={renderSectionFooter}
        isDraggable={props.isDraggable}
        isKanban={props.isKanban}
        isVirtual={props.isVirtual}
        onAddCard={props.onShowFirstCardInput}
        onSetRef={props.onSetListWrapperRef}
      >
        {({ droppableProvided, scrollContainer, isUsingPlaceholder }) => (
          <>
            {props.isFirstCardInputVisible && renderFirstCardInput(props)}
            {props.isVirtual ? (
              <VirtualizedTaskList
                taskIds={props.taskIds}
                listId={props.sectionId}
                userId={props.userId}
                projectId={props.projectId}
                isDraggable={props.isDraggable}
                isKanban={props.isKanban}
                isVirtual={props.isVirtual}
                droppableProvided={droppableProvided}
                isUsingPlaceholder={isUsingPlaceholder}
                scrollContainer={scrollContainer}
                onSetRef={onSetVirtualizedTaskListRef}
              />
            ) : (
              <TaskList
                taskIds={props.taskIds}
                listId={props.sectionId}
                userId={props.userId}
                projectId={props.projectId}
                isDraggable={props.isDraggable}
                isKanban={props.isKanban}
              />
            )}
            {!props.taskIds.size && props.isLastCardInputVisible && renderLastCardInput(props)}
          </>
        )}
      </DraggableSectionListItem>
    </div>
  );

  function renderSectionFooter() {
    return props.isLastCardInputVisible ? (
      props.taskIds.size ? (
        <div className={styles.lastCardInputWrapper}>
          <CardInput
            sectionId={props.sectionId}
            userId={props.userId}
            shouldFocusOnMount
            onClickOutsideDispatched={props.onHideLastCardInput}
            onCreateTaskDispatched={props.onCreateLastCardDispatched}
            onCancelDispatched={props.onHideLastCardInput}
            onMount={scrollToBottom}
            onUpdate={scrollToBottom}
          />
        </div>
      ) : null
    ) : (
      <div
        className={styles.cardInput}
        onClick={() => {
          props.onShowLastCardInput();
          scrollToBottom();
        }}
      >
        <div className={styles.addLastCardButton} data-intercom-target="Create task">
          <Plus />
          <span>{t('Add a task')}</span>
        </div>
      </div>
    );
  }
}

function renderFirstCardInput(props) {
  return (
    <CardInput
      sectionId={props.sectionId}
      userId={props.userId}
      shouldFocusOnMount
      createAtTheBeginning
      onClickOutsideDispatched={props.onHideFirstCardInput}
      onCreateTaskDispatched={props.onCreateFirstCardDispatched}
      onCancelDispatched={props.onHideFirstCardInput}
    />
  );
}

function renderLastCardInput(props) {
  return (
    <CardInput
      sectionId={props.sectionId}
      userId={props.userId}
      shouldFocusOnMount
      onClickOutsideDispatched={props.onHideLastCardInput}
      onCreateTaskDispatched={props.onCreateLastCardDispatched}
      onCancelDispatched={props.onHideLastCardInput}
      onMount={props.onScrollListWrapperToBottom}
    />
  );
}

export default memo(Section);
