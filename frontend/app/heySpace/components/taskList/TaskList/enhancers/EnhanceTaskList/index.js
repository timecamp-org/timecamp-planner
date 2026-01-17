import { AppEventEmitter } from 'common/services';
import { AppEventType } from 'common/types';
import BaseComponent from 'commonEnhancers/BaseComponent';
import { is } from 'immutable';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { CellMeasurerCache } from 'react-virtualized';

const MIN_ROW_HEIGHT = 45;

export default function enhance(Component) {
  class EnhanceTaskList extends BaseComponent {
    static propTypes = {
      listId: PropTypes.string.isRequired,
      projectId: PropTypes.string.isRequired,
      taskIds: ImmutablePropTypes.list,

      isDraggable: PropTypes.bool,
      isKanban: PropTypes.bool,
      isVirtual: PropTypes.bool,
    };

    constructor(props) {
      super(props);
      this.cache = new CellMeasurerCache({
        defaultHeight: MIN_ROW_HEIGHT,
        fixedWidth: true,
      });
    }

    render() {
      return (
        <Component
          taskIds={this.props.taskIds}
          listId={this.props.listId}
          isVirtual={this.props.isVirtual}
          droppableProvided={this.props.droppableProvided}
          isUsingPlaceholder={this.props.isUsingPlaceholder}
          scrollContainer={this.props.scrollContainer}
          cache={this.cache}
          isDraggable={this.props.isDraggable}
          onSetRef={this.onSetRef}
        />
      );
    }

    onSetRef(ref) {
      // react-virtualized has no way to get the list's ref that I can so
      // So we use the `ReactDOM.findDOMNode(ref)` escape hatch to get the ref
      if (ref) {
        this.list = ref;
        // eslint-disable-next-line react/no-find-dom-node
        this.props.onSetRef(ref);

        const whatHasMyLifeComeTo = ReactDOM.findDOMNode(ref);
        if (whatHasMyLifeComeTo instanceof HTMLElement) {
          this.props.droppableProvided.innerRef(whatHasMyLifeComeTo);
        }
      }
    }

    onInvalidateCellHeght({ taskId }) {
      const index = this.props.taskIds.indexOf(taskId);
      if (index >= 0 && this.list) {
        this.cache.clear(index, 0);
        this.list.recomputeRowHeights(index);
      }
    }

    onInvalidateList() {
      this.cache.clearAll();
      if (this.list) {
        this.list.forceUpdateGrid();
      }
    }

    componentDidUpdate(prevProps) {
      if (!is(prevProps.taskIds, this.props.taskIds)) {
        this.onInvalidateList();
      }
    }

    componentDidMount() {
      AppEventEmitter.on(AppEventType.CARD_RESIZED, this.onInvalidateCellHeght);
    }

    componentWillUnmount() {
      AppEventEmitter.off(AppEventType.CARD_RESIZED, this.onInvalidateCellHeght);
    }
  }

  return EnhanceTaskList;
}
