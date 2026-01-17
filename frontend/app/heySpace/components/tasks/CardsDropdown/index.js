import { doNothing } from 'common/utils';
import Dropdown from 'commonComponents/Dropdown';
import { ChevronDown } from 'commonComponents/Icons/fontawesome/ChevronDown';
import { ChevronUp } from 'commonComponents/Icons/fontawesome/ChevronUp';
import SecondaryButton from 'components/buttons/SecondaryButton';
import TaskNameOutput from 'components/tasks/taskName/TaskNameOutput/withTooltip';
import { useTranslation } from 'i18n';
import { List } from 'immutable';
import ImmutablePropTypes from 'immutable-prop-types';
import PropTypes from 'prop-types';

import styles from './styles.css';

const emptyList = new List();

CardsDropdown.propTypes = {
  className: PropTypes.string,
  dropdownClassName: PropTypes.string,
  buttonClassName: PropTypes.string,
  selectedCardId: PropTypes.string,
  color: PropTypes.string,
  cardIds: ImmutablePropTypes.list,

  onSelectCardId: PropTypes.func,
  onClickDropdownButton: PropTypes.func,
};

CardsDropdown.defaultProps = {
  cardIds: emptyList,
  onSelectCardId: doNothing,
  onClickDropdownButton: doNothing,
};

function CardsDropdown(props) {
  const { t } = useTranslation();
  return (
    <Dropdown
      items={props.cardIds}
      className={props.className}
      dropdownClassName={props.dropdownClassName || styles.dropdownContent}
      isDisabled={props.selectedCardId ? false : true}
      onSelectItem={props.onSelectCardId}
      buttonRenderer={renderCardDropdownButton}
      dropdownItemRenderer={renderCardDropdownItem}
    />
  );

  function renderCardDropdownButton(isOpen) {
    const shouldBeDisabled = props.selectedCardId ? false : true;
    const selectClosedClass = props.buttonClassName || styles.dropdownButton;
    const selectOpenClass = props.buttonOpenClassName || styles.dropdownButtonOpen;
    const className = isOpen ? selectOpenClass : selectClosedClass;

    return (
      <SecondaryButton
        className={className}
        color={props.color}
        isDisabled={shouldBeDisabled}
        onClick={props.onClickDropdownButton}
      >
        {shouldBeDisabled ? (
          t('New task')
        ) : (
          <TaskNameOutput className={styles.selectedTask} taskId={props.selectedCardId} />
        )}
        {shouldBeDisabled ? null : isOpen ? (
          <ChevronUp className={styles.dropdownButtonIcon} />
        ) : (
          <ChevronDown className={styles.dropdownButtonIcon} />
        )}
      </SecondaryButton>
    );
  }

  function renderCardDropdownItem(cardId) {
    return (
      <SecondaryButton key={`Card_${cardId || 'Default'}`} className={styles.dropdownItem} color={props.color}>
        <TaskNameOutput className={styles.cardName} taskId={cardId} />
      </SecondaryButton>
    );
  }
}

export default CardsDropdown;
