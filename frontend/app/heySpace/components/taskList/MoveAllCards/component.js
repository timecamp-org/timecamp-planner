import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styles from './styles.css';

import PrimaryButton from 'components/buttons/PrimaryButton';
import SecondaryButton from 'components/buttons/SecondaryButton';

import { useTranslation } from 'i18n';
import ListsDropdown from '../ListsDropdown';

MoveAllCards.propTypes = {
  listIds: ImmutablePropTypes.list.isRequired,
  selectedListId: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,

  onClickDropdownButton: PropTypes.func,
  onChangeSectionId: PropTypes.func,
  onMoveAllCards: PropTypes.func,
  onCancel: PropTypes.func,
};

function MoveAllCards(props) {
  const { t } = useTranslation();
  return (
    <div className={styles.Component}>
      <div className={styles.row}>
        <ListsDropdown
          listIds={props.listIds}
          selectedListId={props.selectedListId}
          onSelectListId={props.onChangeSectionId}
        />
      </div>
      <div className={styles.buttons}>
        <SecondaryButton color={props.color} onClick={props.onCancel}>
          {t('Cancel')}
        </SecondaryButton>
        <PrimaryButton color={props.color} onClick={props.onMoveAllCards}>
          {t('Move Tasks')}
        </PrimaryButton>
      </div>
    </div>
  );
}

export default MoveAllCards;
