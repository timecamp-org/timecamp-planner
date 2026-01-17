import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { useTranslation } from 'i18n/index';

import { doNothing } from '../../../../common/utils';
import colorStyles from '../../../styles/colors.css';
import PrimaryButton from '../../buttons/PrimaryButton';
import SecondaryButton from '../../buttons/SecondaryButton';
import SpacesDropdown from '../../projects/SpacesDropdown';
import ListsDropdown from '../../taskList/ListsDropdown';
import TooltipedDisabledElement from '../TooltipedDisabledElement';

import styles from './styles.css';

ConvertToCardPopoverContent.propTypes = {
  isAddCardDisabled: PropTypes.bool,
  color: PropTypes.string,
  spaceIds: ImmutablePropTypes.list.isRequired,
  listIds: ImmutablePropTypes.list.isRequired,
  selectedSpaceId: PropTypes.string,
  selectedListId: PropTypes.string,
  cardName: PropTypes.string,

  onSelectSpaceId: PropTypes.func,
  onSelectListId: PropTypes.func,
  onClickClosePopover: PropTypes.func,
  onConvertToCard: PropTypes.func,
  onChangeCardName: PropTypes.func,
};

ConvertToCardPopoverContent.defaultProps = {
  isAddCardDisabled: false,
  color: colorStyles.wisteriaColor,

  onSelectSpaceId: doNothing,
  onSelectListId: doNothing,
  onClickClosePopover: doNothing,
  onConvertToCard: doNothing,
  onChangeCardName: doNothing,
};

function ConvertToCardPopoverContent(props) {
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>{t('Add task')}</div>
      </div>
      <div className={styles.separator} />

      <div className={styles.content}>
        <div className={styles.row}>
          <div className={styles.dropdownLabel}>{t('Project')}</div>
          <SpacesDropdown
            spaceIds={props.spaceIds}
            selectedSpaceId={props.selectedSpaceId}
            onSelectSpaceId={props.onSelectSpaceId}
          />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.row}>
          <div className={styles.dropdownLabel}>{t('List')}</div>
          <ListsDropdown
            listIds={props.listIds}
            selectedListId={props.selectedListId}
            onSelectListId={props.onSelectListId}
          />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.row}>
          <label htmlFor={'cardName'} className={styles.dropdownLabel}>
            {t('Task name')}
          </label>
          <textarea
            id={'cardName'}
            rows={3}
            className={styles.textarea}
            value={props.cardName}
            onChange={props.onChangeCardName}
            placeholder={t('Task name')}
          />
        </div>
      </div>

      <div className={styles.buttons}>
        <SecondaryButton className={styles.cancelButton} color={props.color} onClick={props.onClickClosePopover}>
          {t('Cancel')}
        </SecondaryButton>
        <TooltipedDisabledElement
          isDisabled={props.isAddCardDisabled}
          message={t(`As a guest you have no permission to create new Project`)}
        >
          <PrimaryButton color={props.color} isDisabled={props.isAddCardDisabled} onClick={props.onConvertToCard}>
            {t('Add task')}
          </PrimaryButton>
        </TooltipedDisabledElement>
      </div>
    </>
  );
}

export default ConvertToCardPopoverContent;
