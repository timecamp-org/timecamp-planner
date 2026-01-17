import fuzzysearch from 'fuzzysearch';
import { is, List } from 'immutable';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';

import { makeConversationLink } from 'common/utils/routerHelpers';
import BaseComponent from 'commonEnhancers/BaseComponent';
import EnhanceWithRouter from 'enhancers/EnhanceWithRouter';
import { onMemberAdd } from 'models/domain/ProjectsModel/actions';
import { isProjectGroupOrDirectChatByType } from 'models/domain/ProjectsModel/helpers';
import { selectQuickSwitcherConversationSearchDescriptorsSortedByLatestActive } from 'models/domain/ProjectsModel/selectors';
import { ProjectPeopleRole, ProjectType } from 'models/domain/ProjectsModel/types';
import { selectSortedLatestVisitedTasks } from 'models/domain/TasksModel/selectors';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';
import getSpaceUrl from 'utils/getSpaceUrl';

const emptyList = new List();

const MAX_RESULTS_COUNT = 70;

function enhance(ComposedComponent) {
  @EnhanceWithRouter()
  class EnhanceQuickSwitcherModalChatsContent extends BaseComponent {
    static propTypes = {
      searchValue: PropTypes.string,
    };

    static defaultProps = {
      searchValue: '',
    };

    constructor(props) {
      super(props);
      const filteredChatDescriptors = props.chatDescriptorList.slice(0, MAX_RESULTS_COUNT);
      const firstChatDescriptor = filteredChatDescriptors.first();
      this.state = {
        filteredChatDescriptors,
        highlightedObjectId: firstChatDescriptor ? firstChatDescriptor.projectId : null,
      };
    }

    render() {
      return (
        <ComposedComponent
          filteredChatDescriptors={this.state.filteredChatDescriptors}
          highlightedObjectId={this.state.highlightedObjectId}
          searchValue={this.props.searchValue}
          onSetSearchValue={this.onSetSearchValue}
          onGoToProject={this.onGoToProject}
          onJoinSpace={this.onJoinSpace}
          onSetInputRef={this.onSetInputRef}
          onKeyDown={this.onKeyDown}
          onMouseMoveOverListItem={this.onMouseMoveOverListItem}
        />
      );
    }

    inputRef = null;

    shouldMouseHighlightItem = true;

    onSetInputRef(ref) {
      this.inputRef = ref;
    }

    onGoToProject(projectId) {
      const chatDescriptor = this.props.chatDescriptorList.find((descriptor) => descriptor.projectId === projectId);
      switch (chatDescriptor.type) {
        case ProjectType.PROJECT: {
          this.props.history.push(getSpaceUrl(projectId));
          break;
        }

        case ProjectType.GROUP_CHAT:
        case ProjectType.DIRECT_CHAT: {
          const { conversationId } = chatDescriptor;
          this.props.history.push(makeConversationLink(conversationId));
          break;
        }

        default:
          break;
      }

      this.props.onHideModal();
    }

    onJoinSpace(spaceId) {
      this.props.onMemberAdd(spaceId, this.props.currentUserId);
      this.props.history.push(getSpaceUrl(spaceId));
      this.props.onHideModal();
    }

    onSetSearchValue(searchValue) {
      const filteredChatDescriptors = this.filterDescriptors(searchValue);

      const { highlightedObjectId } = this.state;
      const shouldHighlightFirstItem = !filteredChatDescriptors.some(
        (descriptor) => descriptor.projectId === highlightedObjectId
      );
      const firstItem = filteredChatDescriptors.first();
      const firstObjectId = get(firstItem, 'projectId', null);
      const nextHighlightedObjectId = shouldHighlightFirstItem ? firstObjectId : highlightedObjectId;

      this.setState(
        {
          filteredChatDescriptors,
          highlightedObjectId: nextHighlightedObjectId,
        },
        () => this.scrollToHighlightedSpaceId(nextHighlightedObjectId, true, 'instant')
      );
    }

    filterDescriptors(searchValue) {
      if (!searchValue) {
        return this.props.chatDescriptorList;
      }

      let result = emptyList;
      const lowercaseSearchValue = searchValue.toLowerCase();

      this.props.chatDescriptorList.forEach((descriptor) => {
        if (fuzzysearch(lowercaseSearchValue, descriptor.name.toLowerCase())) {
          result = result.push(descriptor);
        }
      });

      result = result.slice(0, MAX_RESULTS_COUNT);

      return result;
    }

    setHighlightedSpaceId(spaceId, isFromKeyDownEvent = true) {
      this.setState({
        highlightedObjectId: spaceId,
      });

      this.scrollToHighlightedSpaceId(spaceId, isFromKeyDownEvent);
    }

    scrollToHighlightedSpaceId(spaceId, isFromKeyDownEvent = true, behavior = 'smooth') {
      if (spaceId && isFromKeyDownEvent) {
        const highlightedItemDOMNode = document.getElementById(`SpacesListSearch-${spaceId}`);

        if (highlightedItemDOMNode) {
          this.shouldMouseHighlightItem = false;
          highlightedItemDOMNode.focus();
          scrollIntoViewIfNeeded(highlightedItemDOMNode, {
            behavior,
            duration: 200,
            scrollMode: 'if-needed',
          });
        }
      }
    }

    onMouseMoveOverListItem(objectId) {
      if (this.state.highlightedObjectId !== objectId) {
        if (this.shouldMouseHighlightItem) {
          this.setHighlightedSpaceId(objectId, false);
        } else {
          this.shouldMouseHighlightItem = true;
        }
      }
    }

    onHighlightPreviousDescriptor() {
      const { highlightedObjectId, filteredChatDescriptors } = this.state;

      const firstId = filteredChatDescriptors.first().projectId;

      if (!highlightedObjectId) {
        this.setHighlightedSpaceId(firstId);
      } else if (highlightedObjectId === firstId) {
        this.setHighlightedSpaceId(filteredChatDescriptors.last().projectId);
      } else {
        const currIndex = filteredChatDescriptors.findIndex(
          (descriptor) => descriptor.projectId === highlightedObjectId
        );

        this.setHighlightedSpaceId(filteredChatDescriptors.get(currIndex - 1).projectId);
      }
    }

    onHighlightNextDescriptor() {
      const { highlightedObjectId, filteredChatDescriptors } = this.state;

      if (!highlightedObjectId) {
        this.setHighlightedSpaceId(filteredChatDescriptors.first().projectId);
      } else if (highlightedObjectId === filteredChatDescriptors.last().projectId) {
        this.setHighlightedSpaceId(filteredChatDescriptors.first().projectId);
      } else {
        const currIndex = filteredChatDescriptors.findIndex(
          (descriptor) => descriptor.projectId === highlightedObjectId
        );

        this.setHighlightedSpaceId(filteredChatDescriptors.get(currIndex + 1).projectId);
      }
    }

    onTabPress(event) {
      const { highlightedObjectId, filteredChatDescriptors } = this.state;
      if (event.shiftKey) {
        if (highlightedObjectId !== filteredChatDescriptors.first().projectId) {
          event.preventDefault();
          this.onHighlightPreviousDescriptor();
        }
      } else {
        if (highlightedObjectId !== filteredChatDescriptors.last().projectId) {
          event.preventDefault();
          this.onHighlightNextDescriptor();
        }
      }
    }

    onKeyDown = (event) => {
      const { key } = event;
      switch (key) {
        case 'ArrowUp': {
          event.preventDefault();
          this.onHighlightPreviousDescriptor();
          break;
        }
        case 'ArrowDown': {
          event.preventDefault();
          this.onHighlightNextDescriptor();
          break;
        }
        case 'Enter': {
          event.preventDefault();
          this.onEnterKeyDown();
          break;
        }
        case 'Tab': {
          this.onTabPress(event);
          break;
        }
        default:
          break;
      }
    };

    onEnterKeyDown() {
      const { highlightedObjectId, filteredChatDescriptors } = this.state;
      if (highlightedObjectId) {
        const highlightedDescriptor = filteredChatDescriptors.find(
          (descriptor) => descriptor.projectId === highlightedObjectId
        );
        const isConversation = isProjectGroupOrDirectChatByType(highlightedDescriptor.get('type'));
        const isCurrentUserSpaceMember = highlightedDescriptor.get('isCurrentUserSpaceMember');
        if (isCurrentUserSpaceMember || isConversation) {
          this.onGoToProject(highlightedObjectId);
        } else {
          this.onJoinSpace(highlightedObjectId);
        }
      }
    }

    componentDidMount() {
      window.addEventListener('keydown', this.onKeyDown);
      this.focusTimeout = setTimeout(() => {
        if (this.inputRef) {
          this.inputRef.focus();
        }
      }, 0);
    }

    componentDidUpdate(prevProps) {
      if (!is(prevProps.chatDescriptorList, this.props.chatDescriptorList)) {
        const filteredChatDescriptors = this.filterDescriptors(this.state.searchValue);
        this.setState({ filteredChatDescriptors });
      }

      if (prevProps.searchValue !== this.props.searchValue) {
        this.onSetSearchValue(this.props.searchValue);
      }
    }

    componentWillUnmount() {
      window.removeEventListener('keydown', this.onKeyDown);
      if (this.focusTimeout) {
        clearInterval(this.focusTimeout);
      }
    }
  }

  function mapStateToProps(state) {
    selectSortedLatestVisitedTasks(state);

    return {
      chatDescriptorList: selectQuickSwitcherConversationSearchDescriptorsSortedByLatestActive(state, {
        shouldIncludeInvisibleConversations: true,
      }),
      currentUserId: selectCurrentUserId(state),
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      onMemberAdd: (spaceId, currentUserId) => dispatch(onMemberAdd(spaceId, currentUserId, ProjectPeopleRole.MEMBER)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceQuickSwitcherModalChatsContent);
}

export default enhance;
