import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { useTranslation } from 'i18n/index';

import { doNothing } from '../../../../common/utils';
import colorStyles from '../../../styles/colors.css';
import PrimaryButton from '../../buttons/PrimaryButton';
import SecondaryButton from '../../buttons/SecondaryButton';
import SpacesDropdown from '../../projects/SpacesDropdown';
import ListsDropdown from '../../taskList/ListsDropdown';
import CardsDropdown from '../../tasks/CardsDropdown';
import TooltipedDisabledElement from '../TooltipedDisabledElement';

import styles from './styles.css';

ConvertToCardCommentPopoverContent.propTypes = {
  isAddCardDisabled: PropTypes.bool,
  color: PropTypes.string,
  spaceIds: ImmutablePropTypes.list.isRequired,
  listIds: ImmutablePropTypes.list.isRequired,
  cardIds: ImmutablePropTypes.list.isRequired,
  selectedSpaceId: PropTypes.string,
  selectedListId: PropTypes.string,
  selectedCardId: PropTypes.string,

  onSelectSpaceId: PropTypes.func,
  onSelectListId: PropTypes.func,
  onSelectCardId: PropTypes.func,
  onClickClosePopover: PropTypes.func,
  onConvertToCardComment: PropTypes.func,
};

ConvertToCardCommentPopoverContent.defaultProps = {
  isAddCardDisabled: false,
  color: colorStyles.wisteriaColor,

  onSelectSpaceId: doNothing,
  onSelectListId: doNothing,
  onClickClosePopover: doNothing,
  onConvertToCardComment: doNothing,
};

function ConvertToCardCommentPopoverContent(props) {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.title}>{t('Convert to task comment')}</div>
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
          <div className={styles.dropdownLabel}>{t('Task')}</div>
          <CardsDropdown
            cardIds={props.cardIds}
            selectedCardId={props.selectedCardId}
            onSelectCardId={props.onSelectCardId}
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
          <PrimaryButton
            color={props.color}
            isDisabled={props.isAddCardDisabled}
            onClick={props.onConvertToCardComment}
          >
            {t('Add')}
          </PrimaryButton>
        </TooltipedDisabledElement>
      </div>
    </div>
  );
}

export default ConvertToCardCommentPopoverContent;
