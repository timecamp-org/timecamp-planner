import { Fragment, memo, useCallback } from 'react';

import { List } from 'immutable';
import ImmutablePropTypes from 'immutable-prop-types';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import PropTypes from 'prop-types';
import { Draggable, Droppable } from '@hello-pangea/dnd';

import { useSelector } from 'common/hooks/useSelector';
import { doNothing, onStopPropagation } from 'common/utils';
import { TaskFiltersTargetType } from 'models/component/FiltersModel/types';
import { makeFilterId } from 'models/component/FiltersModel/utils';
import {
  selectListFilteredTasksCount,
  selectListLimit,
  selectProjectIdByListId,
} from 'models/domain/ListsModel/selectors';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';

import SectionHeader from '../SectionHeader';
import TaskListItem from '../TaskListItem';

import styles from './styles.css';

const emptyList = new List();

DraggableSectionListItem.propTypes = {
  sectionId: PropTypes.string.isRequired,
  shouldRenderProjectIcon: PropTypes.bool,
  showProjectName: PropTypes.bool,
  isDraggable: PropTypes.bool,
  isKanban: PropTypes.bool,
  isVirtual: PropTypes.bool,
  isCardsLimitEnabled: PropTypes.bool,
  sectionOptions: ImmutablePropTypes.list,
  kanbanTaskIds: ImmutablePropTypes.list,
  onAddCard: PropTypes.func.isRequired,
  onSetRef: PropTypes.func.isRequired,
  onSetIsDropdownVisible: PropTypes.func.isRequired,
  onSetListWrapperRef: PropTypes.func.isRequired,
};

DraggableSectionListItem.defaultProps = {
  shouldRenderProjectIcon: false,
  showProjectName: false,
  isDraggable: true,
  isVirtual: false,
  isCardsLimitEnabled: false,
  sectionOptions: emptyList,
  kanbanTaskIds: emptyList,
  onAddCard: doNothing,
  onSetRef: doNothing,
  onSetIsDropdownVisible: doNothing,
  onSetListWrapperRef: doNothing,
};

function DraggableSectionListItem(props) {
  const memoizedGetStyles = memoizeOne(getListStyle, isEqual);

  const listLimit = useSelector((state) => selectListLimit(state, { listId: props.sectionId }));

  const projectId = useSelector((state) => selectProjectIdByListId(state, { listId: props.sectionId }));
  const currentUserId = useSelector(selectCurrentUserId);

  const filterId = makeFilterId(currentUserId, TaskFiltersTargetType.KANBAN, projectId);

  const cardsCount = useSelector((state) =>
    selectListFilteredTasksCount(state, {
      listId: props.sectionId,
      projectId,
      filterId,
    })
  );

  const isLimitOverflow = props.isCardsLimitEnabled && listLimit && cardsCount > listLimit;

  const renderClone = useCallback(
    (provided, snapshot, rubric) => (
      <div
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        className={styles.cardClone}
      >
        <TaskListItem taskId={props.kanbanTaskIds.get(rubric.source.index)} />
      </div>
    ),
    [props.kanbanTaskIds]
  );

  return (
    <Draggable draggableId={props.sectionId} index={props.index} isDragDisabled={!props.isDraggable}>
      {(draggableProvided) => (
        <Droppable
          droppableId={props.sectionId}
          mode={props.isVirtual ? 'virtual' : undefined}
          type={'TASK'}
          renderClone={props.isVirtual ? renderClone : undefined}
        >
          {(provided, snapshot) => {
            const style = memoizedGetStyles(draggableProvided.draggableProps.style, snapshot.isDraggingOver);

            return (
              <div
                className={props.className || styles.Component}
                ref={draggableProvided.innerRef}
                {...draggableProvided.draggableProps}
                {...draggableProvided.dragHandleProps}
                style={style}
                onDoubleClick={onStopPropagation}
                onMouseDown={onStopPropagation}
              >
                {renderSection(props, provided, snapshot, isLimitOverflow)}
              </div>
            );
          }}
        </Droppable>
      )}
    </Draggable>
  );
}

function getListStyle(style, isDraggingOver) {
  const customTransition = `${style.transition || ''}${
    style.transition ? ', ' : ''
  }background-color 0.5s cubic-bezier(.2,1,.1,1)`;
  const transition = isDraggingOver ? customTransition : style.transition;

  return {
    ...style,
    background: getListBackground(isDraggingOver),
    transition,
  };
}

function getListBackground(isDraggingOver) {
  return isDraggingOver ? 'var(--color-gray-200)' : 'var(--color-gray-100)';
}

function renderSection(props, provided, snapshot, isLimitOverflow) {
  const tasksChildrenClassName =
    props.wrapperClassName ||
    `${props.isKanban ? styles.childrenKanban : styles.children} ${isLimitOverflow ? styles.overflow : ''}`;

  return (
    <Fragment>
      <SectionHeader
        shouldRenderProjectIcon={props.shouldRenderProjectIcon}
        showProjectName={props.showProjectName}
        sectionId={props.sectionId}
        sectionOptions={props.sectionOptions}
        isKanban={props.isKanban}
        onAddCard={props.onAddCard}
      />
      <PureTasksComponent
        className={tasksChildrenClassName}
        onSetRef={(ref) => {
          props.onSetRef(ref);
          provided.innerRef(ref);
        }}
        droppableProps={provided.droppableProps}
      >
        <Fragment>
          {props.children({
            droppableProvided: provided,
            scrollContainer: props.scrollContainer,
            isUsingPlaceholder: snapshot.isUsingPlaceholder,
          })}
          {props.isVirtual || provided.placeholder}
        </Fragment>
      </PureTasksComponent>
      {props.renderFooter && props.renderFooter(props.sectionId)}
    </Fragment>
  );
}

const PureTasksComponent = memo((props) => (
  <div className={props.className} ref={props.onSetRef} {...props.droppableProps}>
    {props.children}
  </div>
));

export default memo(DraggableSectionListItem);
