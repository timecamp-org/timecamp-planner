import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { doNothing } from 'common/utils';
import { searchByKeys } from 'common/utils/search';
import { isValidPrintableKey } from 'common/utils/validation';

import EnhanceWithClickOutside from 'react-click-outside';

import BaseComponent from 'commonEnhancers/BaseComponent';

function enhance(Component) {
  @EnhanceWithClickOutside
  class EnhanceDropdown extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      color: PropTypes.string,
      items: ImmutablePropTypes.listOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
      keyValueMap: ImmutablePropTypes.map,
      isDisabled: PropTypes.bool,
      shouldCloseAfterItemClick: PropTypes.bool,

      resizeComponent: PropTypes.func,
      onSelectItem: PropTypes.func.isRequired,
      onClickButtonDispatched: PropTypes.func,
      onClickOutsideDispatched: PropTypes.func,
      onClickDropdownItemDispatched: PropTypes.func,
    };

    static defaultProps = {
      isDisabled: false,
      shouldCloseAfterItemClick: true,

      onClickButtonDispatched: doNothing,
      onClickOutsideDispatched: doNothing,
      onClickDropdownItemDispatched: doNothing,
    };

    state = {
      isOpen: false,
      focusedItemId: this.props.selectedItemId || this.props.items.first(),
    };

    itemRefs = {};
    searchText = '';

    render() {
      return (
        <Component
          {...this.props}
          isOpen={this.state.isOpen}
          focusedItemId={this.state.focusedItemId}
          setDropdownRef={this.setDropdownRef}
          onKeyDown={this.onKeyDown}
          onClickButton={this.onClickButton}
          onClickDropdownItem={this.onClickDropdownItem}
          onSetItemRef={this.onSetItemRef}
        />
      );
    }

    setDropdownRef(ref) {
      this.dropdownRef = ref;
    }

    onClickButton() {
      if (!this.props.isDisabled) {
        const { isOpen } = this.state;

        this.setState(
          {
            isOpen: !isOpen,
          },
          () => {
            if (!isOpen) {
              this.props.resizeComponent();
            }
          }
        );

        this.props.onClickButtonDispatched();
      }
    }

    onClickDropdownItem(itemId) {
      if (this.props.shouldCloseAfterItemClick) {
        this.setState({
          isOpen: false,
          focusedItemId: itemId,
        });
        this.searchText = '';

        this.props.onClickDropdownItemDispatched();
        this.props.onSelectItem(itemId);
      }
    }

    onKeyDown(event) {
      if (this.state.isOpen) {
        const { items } = this.props;
        const focusedItemIndex = items.indexOf(this.state.focusedItemId);
        switch (event.key) {
          case 'ArrowUp': {
            this.searchText = '';
            if (focusedItemIndex === 0) {
              this.setState({
                focusedItemId: items.last(),
              });
              break;
            } else {
              this.setState({
                focusedItemId: items.get(focusedItemIndex - 1),
              });
              break;
            }
          }
          case 'ArrowDown': {
            this.searchText = '';
            if (focusedItemIndex === items.size - 1) {
              this.setState({
                focusedItemId: items.first(),
              });
              break;
            } else {
              this.setState({
                focusedItemId: items.get(focusedItemIndex + 1),
              });
              break;
            }
          }
          case 'Enter': {
            this.searchText = '';
            if (this.props.shouldCloseAfterItemClick) {
              event.preventDefault();
              event.stopPropagation();
              this.setState({
                isOpen: false,
              });
              this.props.onSelectItem(this.state.focusedItemId);
              this.props.onClickDropdownItemDispatched();
            }
            break;
          }

          case 'Escape': {
            this.searchText = '';
            this.setState({
              isOpen: false,
            });
            break;
          }
          case `Backspace`: {
            this.searchText = this.searchText.substring(0, this.searchText.length - 1);
            this.onSearchValues();
            break;
          }
          default: {
            if (!isValidPrintableKey(event.keyCode)) {
              return;
            }
            this.searchText += event.key;
            this.onSearchValues();
            break;
          }
        }
      }
    }

    onSearchValues() {
      const { keyValueMap } = this.props;
      if (!keyValueMap) {
        return;
      }

      const matchKeys = searchByKeys(keyValueMap, this.searchText);
      const itemToFocus = matchKeys.first();
      if (itemToFocus) {
        this.setState({
          focusedItemId: itemToFocus,
        });
        this.onScrollToItem(itemToFocus);
      }
    }

    onSetItemRef(index) {
      return (ref) => {
        this.itemRefs[index] = ref;
      };
    }

    handleClickOutside() {
      this.setState({
        isOpen: false,
      });

      this.props.onClickOutsideDispatched();
    }

    componentDidMount() {
      if (this.dropdownRef) {
        this.dropdownRef.focus();
      }
    }

    onScrollToItem(itemId) {
      if (!itemId) {
        return;
      }
      const itemRef = this.itemRefs[itemId];
      if (itemRef) {
        itemRef.scrollIntoView({ behavior: 'instant', block: 'nearest' });
      }
    }

    componentDidUpdate(prevProps, prevState) {
      const { focusedItemId, isOpen } = this.state;
      if (!prevState.isOpen && isOpen) {
        this.onScrollToItem(focusedItemId);
      }
    }
  }

  return EnhanceDropdown;
}

export default enhance;
