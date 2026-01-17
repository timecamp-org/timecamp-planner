import { is } from 'immutable';

import BaseComponent from '../BaseComponent';

const Enhance =
  ({ itemIdsKey, containerKey, stepSize = 1 }) =>
  (ComposedComponent) => {
    class EnhanceWithDynamicItems extends BaseComponent {
      // eslint-disable-line react/prefer-stateless-function

      static propTypes = {};

      static defaultProps = {};

      constructor(props) {
        super(props);
        if (!itemIdsKey) {
          throw new Error('Insufficient config');
        }
        this.state = {
          itemIds: props[itemIdsKey]?.slice(0, 1),
          containerId: containerKey ? props[containerKey] : undefined,
        };
      }

      loadItemsDynamically() {
        this.loadTimeout = setTimeout(() => {
          const hasMore = this.hasMoreItems();
          this.setState((prev, props) => ({
            itemIds: props[itemIdsKey]?.slice(0, prev.itemIds.size + stepSize),
          }));
          if (hasMore) {
            this.loadItemsDynamically();
          }
        }, 0);
      }

      hasMoreItems() {
        return this.state.itemIds.size + stepSize < this.props[itemIdsKey].size;
      }

      render() {
        const props = {
          ...this.props,
          [itemIdsKey]: this.state.itemIds,
        };

        const hasMoreItems = this.hasMoreItems();
        return <ComposedComponent {...props} hasMore={hasMoreItems} />;
      }

      componentDidUpdate(prevProps) {
        if (prevProps[containerKey] !== this.props[containerKey]) {
          this.loadItemsDynamically();
        } else if (!is(prevProps[itemIdsKey], this.props[itemIdsKey])) {
          const itemDiff = Math.abs(prevProps[itemIdsKey].size - this.props[itemIdsKey].size);
          if (itemDiff > stepSize) {
            this.loadItemsDynamically();
          } else {
            this.setState({ itemIds: this.props[itemIdsKey] });
          }
        }
      }

      static getDerivedStateFromProps(props, state) {
        const newState = state;
        if (props[containerKey] !== newState.containerId && props[itemIdsKey]) {
          newState.itemIds = props[itemIdsKey]?.slice(0, 1);
          newState.containerId = props[containerKey];
        }
        return newState;
      }

      componentDidMount() {
        this.loadItemsDynamically();
      }

      componentWillUnmount() {
        if (this.loadTimeout) {
          clearTimeout(this.loadTimeout);
        }
      }
    }

    return EnhanceWithDynamicItems;
  };

export default Enhance;
