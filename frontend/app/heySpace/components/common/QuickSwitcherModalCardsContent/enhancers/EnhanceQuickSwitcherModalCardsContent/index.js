import fuzzysearch from 'fuzzysearch';
import { is, List } from 'immutable';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';

import BaseComponent from 'commonEnhancers/BaseComponent';
import EnhanceWithRouter from 'enhancers/EnhanceWithRouter';
import { onSetOpenedCardDetailsModalId } from 'models/domain/AppModel/actions';
import { selectSortedLatestVisitedTasksDescriptors } from 'models/domain/TasksModel/selectors';
import getSpaceUrl from 'utils/getSpaceUrl';

const emptyList = new List();
const MAX_RESULTS_COUNT = 70;
// TODO Create superclass which contains all needed methods for Tasks and Chats list or refactor everything to function components
function enhance(ComposedComponent) {
  @EnhanceWithRouter()
  class EnhanceQuickSwitcherModalCardsContent extends BaseComponent {
    static propTypes = {
      cardsDescriptors: ImmutablePropTypes.list.isRequired,
      onOpenCardDetailsModal: PropTypes.func.isRequired,
      searchValue: PropTypes.string,
    };

    static defaultProps = {
      searchValue: '',
    };

    constructor(props) {
      super(props);
      const filteredCardsDescriptors = this.props.cardsDescriptors;
      const firstCardDescriptor = this.props.cardsDescriptors.first();

      this.state = {
        filteredCardsDescriptors,
        highlightedObjectId: firstCardDescriptor ? firstCardDescriptor.get('taskId') : null,
      };

      this.shouldMouseHighlightItem = true;
      this.containerRef = null;
    }

    render() {
      return (
        <ComposedComponent
          searchValue={this.props.searchValue}
          filteredDescriptors={this.state.filteredCardsDescriptors}
          highlightedObjectId={this.state.highlightedObjectId}
          onNavigateToCard={this.onNavigateToCard}
          onNavigateToSpace={this.onNavigateToSpace}
          onMouseMoveOverListItem={this.onMouseMoveOverListItem}
          onSetContainerRef={this.onSetContainerRef}
        />
      );
    }

    onSetContainerRef(ref) {
      this.containerRef = ref;
    }

    onNavigateToCard(taskId) {
      this.props.onHideModal();
      this.props.onOpenCardDetailsModal(taskId);
    }

    onNavigateToSpace(spaceId) {
      this.props.onHideModal();
      this.props.history.push(getSpaceUrl(spaceId));
    }

    setHighlightedSpaceId(spaceId, isFromKeyDownEvent = true) {
      this.setState({
        highlightedObjectId: spaceId,
      });

      if (isFromKeyDownEvent) {
        const highlightedItemDOMNode = document.getElementById(`SpacesListSearch-${spaceId}`);

        if (highlightedItemDOMNode) {
          this.shouldMouseHighlightItem = false;
          highlightedItemDOMNode.focus();
          scrollIntoViewIfNeeded(highlightedItemDOMNode, {
            behavior: 'smooth',
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
      const { highlightedObjectId } = this.state;
      const cardsDescriptors = this.state.filteredCardsDescriptors;

      const firstId = cardsDescriptors.first().get('taskId');

      if (!highlightedObjectId) {
        this.setHighlightedSpaceId(firstId);
      } else if (highlightedObjectId === firstId) {
        this.setHighlightedSpaceId(cardsDescriptors.last().get('taskId'));
      } else {
        const currIndex = cardsDescriptors.findIndex((descriptor) => descriptor.get('taskId') === highlightedObjectId);

        this.setHighlightedSpaceId(cardsDescriptors.get(currIndex - 1).get('taskId'));
      }
    }

    onHighlightNextDescriptor() {
      const { highlightedObjectId } = this.state;
      const cardsDescriptors = this.state.filteredCardsDescriptors;

      if (!highlightedObjectId) {
        this.setHighlightedSpaceId(cardsDescriptors.first().get('taskId'));
      } else if (highlightedObjectId === cardsDescriptors.last().get('taskId')) {
        this.setHighlightedSpaceId(cardsDescriptors.first().get('taskId'));
      } else {
        const currIndex = cardsDescriptors.findIndex((descriptor) => descriptor.get('taskId') === highlightedObjectId);

        this.setHighlightedSpaceId(cardsDescriptors.get(currIndex + 1).get('taskId'));
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
      const { highlightedObjectId } = this.state;

      if (highlightedObjectId) {
        this.onNavigateToCard(highlightedObjectId);
      }
    }

    onSetSearchValue(searchValue) {
      const filteredCardsDescriptors = this.filterDescriptors(searchValue);

      const firstItem = filteredCardsDescriptors.first();
      const firstObjectId = get(firstItem, 'taskId', null);

      this.setState({
        filteredCardsDescriptors,
        highlightedObjectId: firstObjectId,
      });
    }

    filterDescriptors(searchValue) {
      if (!searchValue) {
        return this.props.cardsDescriptors;
      }

      let result = emptyList;
      const lowercaseSearchValue = searchValue.toLowerCase();
      this.props.cardsDescriptors.forEach((descriptor) => {
        if (fuzzysearch(lowercaseSearchValue, descriptor.get('name').toLowerCase())) {
          result = result.push(descriptor);
        }
      });
      result = result.slice(0, MAX_RESULTS_COUNT);

      return result;
    }

    componentDidUpdate(prevProps) {
      if (!is(prevProps.cardsDescriptors, this.props.cardsDescriptors)) {
        const filteredCardsDescriptors = this.filterDescriptors(this.state.searchValue);
        this.setState((state) => ({ ...state, filteredCardsDescriptors }));
      }

      if (prevProps.searchValue !== this.props.searchValue) {
        this.onSetSearchValue(this.props.searchValue);
      }
    }

    componentDidMount() {
      window.addEventListener('keydown', this.onKeyDown);
      if (this.containerRef) {
        this.containerRef.focus();
      }
    }

    componentWillUnmount() {
      window.removeEventListener('keydown', this.onKeyDown);
    }
  }

  const mapStateToProps = (state, props) => ({
    cardsDescriptors: selectSortedLatestVisitedTasksDescriptors(state),
  });

  const mapDispatchToProps = (dispatch, props) => ({
    onOpenCardDetailsModal: (taskId) => dispatch(onSetOpenedCardDetailsModalId(taskId)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceQuickSwitcherModalCardsContent);
}

export default enhance;
