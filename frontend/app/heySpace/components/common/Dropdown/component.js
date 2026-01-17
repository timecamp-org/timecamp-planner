import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { doNothing } from 'common/utils';

import styles from './styles.css';

Dropdown.propTypes = {
  color: PropTypes.string,
  className: PropTypes.string,
  focusedItemClassName: PropTypes.string,

  items: ImmutablePropTypes.listOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  isOpen: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool,
  focusedItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onKeyDown: PropTypes.func.isRequired,

  buttonRenderer: PropTypes.func.isRequired,
  dropdownItemRenderer: PropTypes.func.isRequired,

  // EnhanceWithStretchComponentToBottomWithMargin
  isAutoStretch: PropTypes.bool,
  height: PropTypes.number.isRequired,
  setComponentRef: PropTypes.func.isRequired,
  setDropdownRef: PropTypes.func.isRequired,
  onSetItemRef: PropTypes.func.isRequired,
};

Dropdown.defaultProps = {
  color: '',
  isOpen: false,
  isAutoStretch: true,
  isDisabled: false,

  buttonRenderer: doNothing,
  dropdownItemRenderer: doNothing,
  onClickDropdownItem: doNothing,
  onSetItemRef: doNothing,
  setComponentRef: doNothing,
  setDropdownRef: doNothing,
};

function Dropdown(props) {
  return (
    <div
      ref={props.setDropdownRef}
      className={`
        ${props.className || styles.Component}
        ${props.isDisabled ? styles.disabled : ''}
      `}
      onKeyDown={props.onKeyDown}
      tabIndex={-1}
    >
      <div className={props.classNameButton || styles.button} onClick={props.onClickButton}>
        {props.buttonRenderer(props.isOpen)}
      </div>
      <div
        className={`
          ${props.isOpen ? props.dropdownClassName || styles.dropdown : styles.borderHidden}
        `}
        style={{
          maxHeight: props.isAutoStretch ? props.height : undefined,
          zIndex: 100000,
        }}
        ref={props.setComponentRef}
      >
        {props.isOpen && props.items.map(renderDropdownItem)}
      </div>
    </div>
  );

  function renderDropdownItem(item) {
    return (
      <div
        key={`DropdownItem_${item}`}
        className={`${props.focusedItemId === item ? props.focusedItemClassName || styles.dropdownItemFocused : ''} ${
          styles.item
        }`}
        onClick={() => props.onClickDropdownItem(item)}
        ref={props.onSetItemRef(item)}
      >
        {props.dropdownItemRenderer(item, props.focusedItemId === item)}
      </div>
    );
  }
}

export default Dropdown;
