import { memo } from 'react';

import isSameYear from 'date-fns/is_same_year';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import { epochNow } from 'common/utils/epoch';
import { ArrowsRotate } from 'commonComponents/Icons/fontawesome/ArrowsRotate';
import PopoverContent from 'commonComponents/PopoverContent';
import UniversalPopover from 'commonComponents/UniversalPopover';
import SecondaryButton from 'components/buttons/SecondaryButton';
import DateOutput from 'components/date/DateOutput';
import CardRecurrencySettingsModalContent from 'components/tasks/CardRecurrencySettingsModalContent';
import commonStyles from 'styles/common.css';

import { useTranslation } from '../../../../common/i18n';

import styles from './styles.css';

CardDetailsRecurrencyController.propTypes = {
  taskId: PropTypes.string.isRequired,
  className: PropTypes.string,
  color: PropTypes.string,
  isControllerOpen: PropTypes.bool,
  nextRecurrenceAt: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),

  onControllerClick: PropTypes.func,
  onSetIsControllerOpen: PropTypes.func,
  onKeyDown: PropTypes.func,
  onClickOutside: PropTypes.func,
};

CardDetailsRecurrencyController.defaultProps = {
  isControllerOpen: false,
  onControllerClick: doNothing,
  onSetIsControllerOpen: doNothing,
  onKeyDown: doNothing,
  onClickOutside: doNothing,
};

function CardDetailsRecurrencyController(props) {
  const { t } = useTranslation();

  return (
    <PopoverContent onClickOutside={props.onClickOutside} isVisible={props.isControllerOpen}>
      <UniversalPopover
        isPopoverOpened={props.isControllerOpen}
        targetComponent={renderTarget(props, t)}
        popperComponent={renderPopoverContent(props)}
        popperPlacement={'bottom-end'}
        popperModifiers={{
          offset: {
            offset: `0, ${parseInt(commonStyles.gridCellSize, 10) * 2}`,
          },
        }}
      />
    </PopoverContent>
  );
}

function renderTarget(props, t) {
  return (
    <SecondaryButton onClick={props.onControllerClick} className={styles.button}>
      <ArrowsRotate className={styles.icon} />
      {props.nextRecurrenceAt ? renderRecurringDate(props, t) : <span>{t('Make recurring')}</span>}
    </SecondaryButton>
  );
}

function renderRecurringDate(props, t) {
  let format = 'MMM D, YYYY';
  if (isSameYear(props.nextRecurrenceAt, epochNow())) {
    format = 'MMM D';
  }
  return (
    <span>
      <span className={styles.recurringLabel}>{t('Upcoming:')}</span>
      <DateOutput timestamp={props.nextRecurrenceAt} format={format} />
    </span>
  );
}

function renderPopoverContent(props) {
  return <CardRecurrencySettingsModalContent taskId={props.taskId} onCloseModal={props.onClickOutside} />;
}

export default memo(CardDetailsRecurrencyController);
