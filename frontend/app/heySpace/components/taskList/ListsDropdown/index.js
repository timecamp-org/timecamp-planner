import { List } from 'immutable';
import ImmutablePropTypes from 'immutable-prop-types';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import Dropdown from 'commonComponents/Dropdown';
import { ChevronDown } from 'commonComponents/Icons/fontawesome/ChevronDown';
import { ChevronUp } from 'commonComponents/Icons/fontawesome/ChevronUp';
import SecondaryButton from 'components/buttons/SecondaryButton';
import ListNameOutput from 'components/taskList/ListNameOutput/withTooltip';
import { useTranslation } from 'i18n';

import styles from './styles.css';

const emptyList = new List();

ListsDropdown.propTypes = {
  className: PropTypes.string,
  dropdownClassName: PropTypes.string,
  buttonClassName: PropTypes.string,
  buttonOpenClassName: PropTypes.string,
  selectedListId: PropTypes.string,
  color: PropTypes.string,
  listIds: ImmutablePropTypes.list,

  onSelectListId: PropTypes.func,
  onClickDropdownButton: PropTypes.func,
};

ListsDropdown.defaultProps = {
  listIds: emptyList,
  onSelectListId: doNothing,
  onClickDropdownButton: doNothing,
};

function ListsDropdown(props) {
  const { t } = useTranslation();

  return (
    <Dropdown
      items={props.listIds}
      className={props.className}
      dropdownClassName={props.dropdownClassName || styles.dropdownContent}
      isDisabled={props.selectedListId ? false : true}
      onSelectItem={props.onSelectListId}
      buttonRenderer={renderListDropdownButton}
      dropdownItemRenderer={renderListDropdownItem}
      selectedItemId={props.selectedListId}
    />
  );

  function renderListDropdownButton(isOpen) {
    const shouldBeDisabled = props.selectedListId ? false : true;
    const selectClosedClass = props.buttonClassName || styles.dropdownButton;
    const selectOpenClass = props.buttonOpenClassName || styles.dropdownButtonOpen;
    const className = isOpen ? selectOpenClass : selectClosedClass;

    return (
      <SecondaryButton
        className={className}
        color={props.color}
        isDisabled={shouldBeDisabled}
        onClick={props.onClickDropdownButton}
        isActive={isOpen}
      >
        {shouldBeDisabled ? (
          t('New list')
        ) : (
          <ListNameOutput className={styles.selectedList} listId={props.selectedListId} />
        )}
        {shouldBeDisabled ? null : isOpen ? (
          <ChevronUp className={styles.dropdownButtonIcon} />
        ) : (
          <ChevronDown className={styles.dropdownButtonIcon} />
        )}
      </SecondaryButton>
    );
  }

  function renderListDropdownItem(listId) {
    return (
      <SecondaryButton key={`List_${listId || 'Default'}`} className={styles.dropdownItem}>
        <ListNameOutput className={styles.listName} listId={listId} />
      </SecondaryButton>
    );
  }
}

export default ListsDropdown;
