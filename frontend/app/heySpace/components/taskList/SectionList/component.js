import { memo } from 'react';

import { List } from 'immutable';
import PropTypes from 'prop-types';
import { Droppable } from '@hello-pangea/dnd';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { doNothing } from 'common/utils';
import BoardSkeletonLoader from 'commonComponents/skeletons/BoardSkeletonLoader';
import AddCardWithListAndSpacePicker from 'components/chat/AddCardWithListAndSpacePicker';
import TaskSectionInput from 'components/taskList/TaskSectionInput';

import AddSection from '../AddSection';
import EmptyTaskListPlaceholder from '../EmptyTaskListPlaceholder';
import Section from '../Section';

import styles from './styles.css';

const emptyList = new List();

SectionList.propTypes = {
  className: PropTypes.string,
  innerClassName: PropTypes.string,
  sectionClassName: PropTypes.string,
  tooltip: PropTypes.object,
  isTaskSearchFocused: PropTypes.bool,
  isMyTaskList: PropTypes.bool,
  projectBackground: PropTypes.string,
  listIds: ImmutablePropTypes.list.isRequired,

  shouldRenderAddSectionButton: PropTypes.bool,
  onSetIsSectionInputFocused: PropTypes.func,
  isDraggable: PropTypes.bool,
  isKanban: PropTypes.bool,
  isVirtual: PropTypes.bool,
  onMouseDown: PropTypes.func,

  onSetInnerRef: PropTypes.func,

  shouldRenderFirstSectionInput: PropTypes.bool,
  onSetShouldRenderFirstSectionInput: PropTypes.func,

  onWorkspaceDoubleClick: PropTypes.func,
};

SectionList.defaultProps = {
  shouldRenderAddSectionButton: false,
  tooltip: {},
  isDraggable: true,
  isKanban: false,
  isVirtual: false,
  isMyTaskList: false,
  projectBackground: '',

  listIds: emptyList,
  onSetInnerRef: doNothing,
  onMouseDown: doNothing,
  isSectionInputFocused: false,
  onSetIsSectionInputFocused: doNothing,

  shouldRenderFirstSectionInput: false,
  onSetShouldRenderFirstSectionInput: doNothing,

  onWorkspaceDoubleClick: doNothing,
};

function SectionList(props) {
  return (
    <div
      ref={props.onSetInnerRef}
      className={`${props.className || styles.Component} ${styles.background}`}
      style={{ height: props.taskListWrapperHeight }}
      onMouseDown={props.onMouseDown}
    >
      {props.isLoading ? renderSkeleton(props) : null}
      {renderContent(props)}
    </div>
  );
}

function renderContent(props) {
  const shouldRenderEmptyTaskList = props.listIds.isEmpty() && props.isSearchingTasks;
  const shouldRenderFirstSectionInput = props.shouldRenderFirstSectionInput && !props.isLoading;
  const shouldRenderAddSectionButton = props.shouldRenderAddSectionButton && !props.isLoading;
  const shouldRenderAddCardWithListAndSpacePicker = props.shouldRenderAddCardWithListAndSpacePicker && !props.isLoading;
  const shouldRenderAddListTooltip = props.tooltip.width && props.tooltip.height && props.isKanban;

  return (
    <>
      {shouldRenderEmptyTaskList ? (
        <EmptyTaskListPlaceholder />
      ) : (
        <>
          {shouldRenderFirstSectionInput && renderAddFirstSectionInput(props)}
          {!props.listIds.isEmpty() && renderSectionList(props)}
          {shouldRenderAddSectionButton && renderAddSectionButton(props)}
          {shouldRenderAddCardWithListAndSpacePicker && renderAddCardWithListAndSpacePicker(props)}
        </>
      )}

      {shouldRenderAddListTooltip && renderAddListTooptip(props)}
    </>
  );
}

function renderSkeleton() {
  return (
    <div className={styles.loaderWrapper}>
      <BoardSkeletonLoader />
    </div>
  );
}

function renderSectionList(props) {
  return (
    <PureSectionListComponent
      className={props.sectionClassName}
      innerClassName={props.innerClassName}
      projectId={props.projectId}
      isKanban={props.isKanban}
      isVirtual={props.isVirtual}
      isMyTaskList={props.isMyTaskList}
      listIds={props.listIds}
      userId={props.userId}
      sectionOptions={props.sectionOptions}
      isDraggable={props.isDraggable}
      onWorkspaceDoubleClick={props.onWorkspaceDoubleClick}
    />
  );
}

function renderAddCardWithListAndSpacePicker(props) {
  return (
    <div className={styles.intercomMargin}>
      <AddCardWithListAndSpacePicker
        userId={props.userId}
        onSetIsFocused={props.onSetisAddCardWithListAndSpacePickerOpen}
      />
    </div>
  );
}

function renderAddListTooptip(props) {
  const { x, y, width, height, id } = props.tooltip;

  return (
    <div
      className={styles.tooltip}
      style={{
        width,
        height,
        left: x || 0,
        top: y || 0,
      }}
    >
      <AddSection
        objectId={props.projectId}
        sectionId={id}
        onAddSectionDispatched={props.onAddSectionDispatched}
        onCancel={props.onAddSectionCancelled}
      />
    </div>
  );
}

function renderAddFirstSectionInput(props) {
  return (
    <div className={styles.addFirstSectionButtonWrapper}>
      <div className={styles.addSectionButton}>
        <TaskSectionInput
          className={styles.taskSectionInput}
          projectId={props.projectId}
          isFocused={true}
          createSectionAtTheBeginning={true}
          onSetIsFocused={props.onSetShouldRenderFirstSectionInput}
        />
      </div>
      <div onDoubleClick={(event) => props.onWorkspaceDoubleClick(event, undefined)} className={styles.columnFull} />
    </div>
  );
}

function renderAddSectionButton(props) {
  return (
    <div
      className={`${props.isKanban ? styles.addSectionButtonWrapperKanban : styles.addSectionButtonWrapper} ${
        props.isKanban ? null : styles.intercomMargin
      }`}
    >
      <div className={styles.addSectionButton}>
        <TaskSectionInput
          className={styles.taskSectionInput}
          projectId={props.projectId}
          isFocused={props.isSectionInputFocused}
          onSetIsFocused={props.onSetIsSectionInputFocused}
        />
      </div>
      <div onDoubleClick={(event) => props.onWorkspaceDoubleClick(event, undefined)} className={styles.columnFull} />
    </div>
  );
}

export default memo(SectionList);

function SectionListComponent(props) {
  return (
    <Droppable droppableId={props.projectId} type={'SECTION'} direction={props.isKanban ? 'horizontal' : 'vertical'}>
      {renderDroppableInner}
    </Droppable>
  );

  function renderDroppableInner(provided) {
    return (
      <div
        className={props.isKanban ? props.innerClassName || styles.horizontal : ''}
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
        <InnerList {...props} />
        {provided.placeholder}
      </div>
    );
  }
}

const InnerList = memo(function (props) {
  return props.listIds.map(renderSection);

  function renderSection(sectionId, index) {
    const nextSectionId = props.listIds.get(index + 1);

    return (
      <Section
        sectionId={sectionId}
        nextSectionId={nextSectionId}
        className={props.className}
        index={index}
        key={`Section_${sectionId}`}
        isKanban={props.isKanban}
        isVirtual={props.isVirtual}
        userId={props.userId}
        projectId={props.projectId}
        sectionOptions={props.sectionOptions}
        isMyTaskList={props.isMyTaskList}
        isDraggable={props.isDraggable}
        onWorkspaceDoubleClick={props.onWorkspaceDoubleClick}
      />
    );
  }
});

const PureSectionListComponent = memo(SectionListComponent);
