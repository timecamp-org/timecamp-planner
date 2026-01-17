import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeFilterId } from 'models/component/FiltersModel/utils';
import BaseComponent from 'commonEnhancers/BaseComponent';

import { List } from 'immutable';

import { TaskFiltersTargetType } from 'models/component/FiltersModel/types';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';
import { selectProjectIdsByTaskIdsDomain } from 'models/domain/TasksModel/selectors/domain';
import {
  selectDirectChatPartner,
  selectProjectIdByConversationId,
} from 'models/domain/ProjectsModel/selectors';
import * as SearchModelSelectors from 'models/component/SearchModel/selectors/domain';
import {
  selectConversationArchivedListIds,
  selectConversationListIds,
} from 'models/domain/ListsModel/selectors';
import EnhanceWithRouter from 'enhancers/EnhanceWithRouter';
import { selectRequestIsLoadingInitially } from 'models/domain/RequestModel/selectors';
import * as RequestTypesConstants from 'models/domain/RequestModel/constants/requestTypes';
import { selectFilterByProperty } from 'models/component/FiltersModel/selectors';
import { getRequestTypeWithParams } from '../../../../../../common/models/domain/RequestModel/helpers';
import { TaskStatusFilterType } from '../../../../../../common/models/domain/TasksModel/types';

const columnWidth = 270;
const sectionOptions = new List(['AddCard']);

export default function enhance(Component) {
  @EnhanceWithRouter()
  class EnhanceMyTaskList extends BaseComponent {
    static propTypes = {
      // projectId: PropTypes.string.isRequired,

      isKanban: PropTypes.bool,
      isVirtual: PropTypes.bool,
    };

    static defaultProps = {
      isKanban: false,
      isVirtual: false,
    };

    constructor(props) {
      super(props);
      this.state = {
        tooltip: {},
        isSectionInputFocused: false,
      };
    }

    render() {
      return (
        <Component
          className={this.props.className}
          sectionClassName={this.props.sectionClassName}
          listIds={this.props.listIds}
          projectId={this.props.projectId}
          tooltip={this.state.tooltip}
          isKanban={this.props.isKanban}
          isVirtual={this.props.isVirtual}
          isMyTaskList={true}
          userId={this.props.userId}
          taskProjectId={this.props.taskProjectId}
          isLoading={this.props.isLoading}
          sectionOptions={sectionOptions}
          shouldRenderAddSectionButton={this.props.shouldRenderAddSectionButton}
          innerRef={this.innerRef}
          onAddSectionDispatched={this.onAddSectionDispatched}
          onAddSectionCancelled={this.onAddSectionCancelled}
          isSectionInputFocused={this.state.isSectionInputFocused}
          isSearchingTasks={this.props.isSearchingTasks}
          onSetIsSectionInputFocused={this.onSetIsSectionInputFocused}
          isDraggable={false}
          shouldRenderAddCardWithListAndSpacePicker={true}
          shouldRenderFirstSectionInput={
            this.props.shouldRenderFirstSectionInput
          }
          onSetShouldRenderFirstSectionInput={
            this.props.onSetShouldRenderFirstSectionInput
          }
          onSetisAddCardWithListAndSpacePickerOpen={
            this.onSetisAddCardWithListAndSpacePickerOpen
          }
        />
      );
    }

    onSetisAddCardWithListAndSpacePickerOpen(isFocused) {
      if (isFocused) {
        this.props.onScrollTaskListToBottom();
      }
    }

    onShowLastCardInput(sectionId) {
      const id = sectionId || this.props.sectionIds.first();
      this.setState({
        isSectionLastCardInputVisible: {
          [id]: true,
        },
      });
    }

    innerRef(ref) {
      this.taskListRef = ref;

      if (!this.taskListBottom && !this.taskListRight) {
        const { bottom, right, left } =
          this.taskListRef.getBoundingClientRect();
        this.taskListBottom = bottom;
        this.taskListRight = right;
        this.taskListWidth = right - left;
      }
    }

    onAddSectionDispatched() {
      this.addSectionDispatched = true;
      this.setState({
        tooltip: {},
      });
    }

    onAddSectionCancelled() {
      this.setState({
        tooltip: {},
      });
    }

    onSetIsSectionInputFocused(isSectionInputFocused) {
      this.setState({ isSectionInputFocused });
    }

    scrollToSection(index) {
      const left = index * columnWidth;

      if (this.taskListRef.scrollLeft > left || left > this.taskListWidth) {
        this.taskListRef.scrollTo(left, 0);
      }
    }
  }

  function mapStateToProps(state, ownProps) {
    const currentUserId = selectCurrentUserId(state);
    const objectId = ownProps.match.params.projectId;
    const userId = selectDirectChatPartner(state, { conversationId: objectId });
    const taskProjectId = selectProjectIdsByTaskIdsDomain(state);
    const projectId = selectProjectIdByConversationId(state, {
      conversationId: objectId,
    });
    const filterId = makeFilterId(
      currentUserId,
      TaskFiltersTargetType.KANBAN_VERTICAL,
      projectId
    );
    const fetchArchived =
      selectFilterByProperty(state, { filterId, property: 'status' }) ===
      TaskStatusFilterType.ARCHIVED;
    const getConversationViewDataRequestType = getRequestTypeWithParams(
      RequestTypesConstants.getConversationViewData,
      { fetchArchived }
    );
    const isConversationViewDataLoading = selectRequestIsLoadingInitially(
      state,
      {
        requestType: getConversationViewDataRequestType,
        objectId: projectId,
      }
    );

    const listIds = fetchArchived
      ? selectConversationArchivedListIds(state, { userId })
      : selectConversationListIds(state, { userId });

    return {
      listIds,
      projectId,
      filterId,
      userId,
      taskProjectId,
      isSearchingTasks: SearchModelSelectors.selectIsSearchingTasks(state),
      isLoading: isConversationViewDataLoading,
    };
  }

  return connect(mapStateToProps)(EnhanceMyTaskList);
}
