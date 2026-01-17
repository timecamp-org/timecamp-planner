import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { UserTracker } from 'common/services';
import BaseComponent from 'commonEnhancers/BaseComponent';
import { TaskFiltersTargetType } from 'models/component/FiltersModel/types';
import { makeFilterId } from 'models/component/FiltersModel/utils';
import * as SearchModelActions from 'models/component/SearchModel/actions';
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants';
import { onSetKanbanScrollLeft } from 'models/domain/ProjectsModel/actions';
import {
  selectIsProjectOnboarding,
  selectProjectColor,
} from 'models/domain/ProjectsModel/selectors';
import { ProjectPanelType } from 'models/domain/ProjectsSettingsModel/types';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';

import { onSetProjectLastOpenedPanel } from '../../../../../../utils/lastOpenedPanelController';

function Enhance(ComposedComponent) {
  class EnhanceTasksListRightPanelChat extends BaseComponent {
    static propTypes = {
      projectId: PropTypes.string.isRequired,
      isConversation: PropTypes.bool,
      isKanban: PropTypes.bool,
    };

    state = {
      isTaskSearchFocused: false,
      isSectionInputFocused: false,
      shouldRenderFirstSectionInput: false,
    };

    kanbanRef = null;

    isMouseDown = false;

    lastClientX = null;

    render() {
      return (
        <ComposedComponent
          projectId={this.props.projectId}
          isTaskSearchFocused={this.state.isTaskSearchFocused}
          isSectionInputFocused={this.state.isSectionInputFocused}
          isConversation={this.props.isConversation}
          isKanban={this.props.isKanban}
          isFilterDropdownVisible={this.state.isFilterDropdownVisible}
          color={this.props.color}
          filterId={this.props.filterId}
          onSetTaskListRef={this.onSetTaskListRef}
          onSetIsTaskSearchFocused={this.onSetIsTaskSearchFocused}
          onSetTaskListWrapperRef={this.onSetTaskListWrapperRef}
          onScrollTaskListToBottom={this.onScrollTaskListToBottom}
          onClickAddTaskButton={this.onClickAddTaskButton}
          shouldRenderFirstSectionInput={
            this.state.shouldRenderFirstSectionInput
          }
          onSetShouldRenderFirstSectionInput={
            this.onSetShouldRenderFirstSectionInput
          }
          onSetKanbanRef={this.onSetKanbanRef}
          onMouseDown={this.onMouseDown}
        />
      );
    }

    onSetKanbanRef(ref) {
      this.kanbanRef = ref;
    }

    onMouseDown() {
      var htmlElement = document.getElementsByTagName('html');
      if (htmlElement) {
        htmlElement[0].classList.add('reset-all-cursors');
      } else {
        // ok
      }

      document.documentElement.style.setProperty('cursor', 'move', 'important');
      this.isMouseDown = true;
    }

    onMouseUp() {
      var htmlElement = document.getElementsByTagName('html');
      if (htmlElement) {
        htmlElement[0].classList.remove('reset-all-cursors');
      } else {
        // ok
      }

      document.documentElement.style.setProperty('cursor', '');
      this.isMouseDown = false;
    }

    onMouseMove(event) {
      if (this.isMouseDown && this.kanbanRef) {
        const { scrollLeft } = this.kanbanRef;
        this.kanbanRef.scrollLeft =
          scrollLeft + (-event.clientX + this.lastClientX);
      }

      this.lastClientX = event.clientX;
    }

    onSaveScrollPosition(scrollLeft, objectId) {
      if (scrollLeft !== null) {
        this.props.onSetKanbanScrollLeft(scrollLeft, objectId);
      }
    }

    getScrollLeft() {
      if (this.kanbanRef) {
        const { scrollLeft } = this.kanbanRef;
        if (scrollLeft !== null && typeof scrollLeft !== 'undefined') {
          return scrollLeft;
        }
      }

      return null;
    }

    onLoadScrollPosition(kanbanScrollLeft) {
      if (
        this.kanbanRef &&
        kanbanScrollLeft !== null &&
        typeof kanbanScrollLeft !== 'undefined'
      ) {
        this.kanbanRef.scrollLeft = kanbanScrollLeft;
      }
    }

    onSetShouldRenderFirstSectionInput(shouldRenderFirstSectionInput) {
      this.setState({ shouldRenderFirstSectionInput });
    }

    onSetTaskListRef(ref) {
      this.taskListRef = ref;
    }

    onScrollTaskListToBottom() {
      setImmediate(() => {
        if (this.taskListWrapperRef) {
          this.taskListWrapperRef.scrollTo(
            0,
            this.taskListWrapperRef.scrollHeight
          );
        }
      });
    }

    onSetTaskListWrapperRef(ref) {
      this.taskListWrapperRef = ref;
    }

    onSetIsTaskSearchFocused(isTaskSearchFocused) {
      this.setState({ isTaskSearchFocused });
    }

    onClickAddTaskButton() {
      if (this.taskListRef) {
        this.taskListRef.onShowFirstCardInput();
      }
    }

    onScrollTop() {
      if (this.taskListWrapperRef) {
        this.taskListWrapperRef.scrollTo(0, 0);
      }
    }

    componentDidMount() {
      document.addEventListener(
        'TaskListRightPanelChat_ScrollTop',
        this.onScrollTop
      );
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);

      this.onUpdateLastPanelType();
      this.props.onClearTaskSearchValue();

      if (this.props.isProjectOnboarding) {
        UserTracker.track(UserTrackerEvent.pageOpen, {
          type: 'onboarding task lists',
        });
      }
      // TODO: make it work with virtualisation
      // this.onLoadScrollPosition(this.props.kanbanScrollLeft)
    }

    componentWillUnmount() {
      document.removeEventListener(
        'TaskListRightPanelChat_ScrollTop',
        this.onScrollTop
      );
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
      // TODO: make it work with virtualisation
      // const scrollLeft = this.getScrollLeft()
      // this.onSaveScrollPosition(scrollLeft, this.props.projectId)
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
      if (prevProps.projectId !== this.props.projectId) {
        return { scrollLeft: this.getScrollLeft() };
      }

      return {};
    }

    onUpdateLastPanelType() {
      if (this.props.isKanban) {
        onSetProjectLastOpenedPanel(
          this.props.projectId,
          ProjectPanelType.KANBAN
        );
      }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      if (this.props.projectId !== prevProps.projectId) {
        // this.onLoadScrollPosition(this.props.kanbanScrollLeft)
        // this.onSaveScrollPosition(snapshot.scrollLeft, prevProps.projectId)
      }

      this.onUpdateLastPanelType();
    }
  }

  const mapStateToProps = (state, props) => {
    const currentUserId = selectCurrentUserId(state);
    const filterId = makeFilterId(
      currentUserId,
      props.isKanban
        ? TaskFiltersTargetType.KANBAN
        : TaskFiltersTargetType.KANBAN_VERTICAL,
      props.projectId
    );

    return {
      color: selectProjectColor(state, { projectId: props.projectId }),
      isProjectOnboarding: selectIsProjectOnboarding(state, {
        projectId: props.projectId,
      }),
      filterId,
    };
  };

  function mapDispatchToProps(dispatch, props) {
    return {
      onClearTaskSearchValue: () =>
        dispatch(SearchModelActions.searchTasks('', props.projectId)),
      onSetKanbanScrollLeft: (scrollLeft, objectId) =>
        dispatch(onSetKanbanScrollLeft(objectId, scrollLeft)),
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceTasksListRightPanelChat);
}

export default Enhance;
