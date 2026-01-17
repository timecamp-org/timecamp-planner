import React from 'react';
import BaseComponent from 'commonEnhancers/BaseComponent';
import { connect } from 'react-redux';
import {
  selectFilteredTaskIdsByListId,
  selectProjectIdByListId,
  selectConversationFilteredTaskIdsByListId,
} from 'models/domain/ListsModel/selectors';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';
import { TaskFiltersTargetType, TaskFiltersContainerType } from 'models/component/FiltersModel/types';
import { makeFilterId } from 'models/component/FiltersModel/utils';
import { selectCurrentPathname } from 'models/domain/RouterModel/selectors';
function Enhance(ComposedComponent) {
  class EnhanceSection extends BaseComponent {
    static propTypes = {};

    state = {
      isFirstCardInputVisible: false,
      isLastCardInputVisible: false,
    };

    render() {
      return (
        <ComposedComponent
          {...this.props}
          isFirstCardInputVisible={this.state.isFirstCardInputVisible}
          isLastCardInputVisible={this.state.isLastCardInputVisible}
          onSetListWrapperRef={this.onSetListWrapperRef}
          onScrollListWrapperToBottom={this.onScrollListWrapperToBottom}
          onShowFirstCardInput={this.onShowFirstCardInput}
          onHideFirstCardInput={this.onHideFirstCardInput}
          onShowLastCardInput={this.onShowLastCardInput}
          onHideLastCardInput={this.onHideLastCardInput}
          onDoubleClick={this.onDoubleClick}
          onCreateFirstCardDispatched={this.onCreateFirstCardDispatched}
          onCreateLastCardDispatched={this.onCreateLastCardDispatched}
        />
      );
    }

    onSetListWrapperRef(ref) {
      this.listWrapper = ref;
    }

    onScrollListWrapperToBottom() {
      this.scrollImmediate = setImmediate(this.onScrollListWrapperToBottomCallback);
    }

    onScrollListWrapperToBottomCallback() {
      if (this.listWrapper) {
        this.listWrapper.scrollTop = this.listWrapper.scrollHeight;
      }
    }

    onShowFirstCardInput() {
      this.setState({
        isFirstCardInputVisible: true,
      });
    }

    onHideFirstCardInput() {
      this.setState({
        isFirstCardInputVisible: false,
      });
    }

    onShowLastCardInput() {
      this.setState({
        isLastCardInputVisible: true,
      });
    }

    onHideLastCardInput() {
      this.setState({
        isLastCardInputVisible: false,
      });
    }

    onDoubleClick(event) {
      if (this.props.isKanban) {
        this.props.onWorkspaceDoubleClick(event, this.props.sectionId, this.props.nextSectionId);
      }
    }

    onCreateLastCardDispatched(shouldHideInput = true) {
      if (shouldHideInput) {
        this.onHideLastCardInput();
      }
      this.onScrollListWrapperToBottom();
    }

    onCreateFirstCardDispatched() {
      this.onHideFirstCardInput();
    }

    componentWillUnmount() {
      if (this.scrollImmediate) {
        clearImmediate(this.scrollImmediate);
      }
    }
  }

  function mapStateToProps(state, props) {
    const currentUserId = selectCurrentUserId(state);
    const listProjectId = selectProjectIdByListId(state, {
      listId: props.sectionId,
    });
    const currentPathname = selectCurrentPathname(state);

    const filterTargetType = currentPathname.includes('/overwatch')
      ? TaskFiltersContainerType.OVERWATCH_SPACE_TILE
      : props.userId || !props.isKanban
      ? TaskFiltersTargetType.KANBAN_VERTICAL
      : TaskFiltersTargetType.KANBAN;

    const filterId = makeFilterId(currentUserId, filterTargetType, props.projectId);
    const taskIds = props.userId
      ? selectConversationFilteredTaskIdsByListId(state, {
          userId: props.userId,
          listId: props.sectionId,
          filterId,
          projectId: listProjectId,
        })
      : selectFilteredTaskIdsByListId(state, {
          listId: props.sectionId,
          filterId,
          projectId: listProjectId,
        });

    return {
      taskIds,
    };
  }

  return connect(mapStateToProps)(EnhanceSection);
}

export default Enhance;
