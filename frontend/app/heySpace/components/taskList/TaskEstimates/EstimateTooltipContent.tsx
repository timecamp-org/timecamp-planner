import { FC, useState } from 'react';

import { Button, ButtonBase } from '@mui/material';
import { List } from 'immutable';
import { get } from 'lodash';

import { useKeyboard } from 'common/hooks/useKeyBoard';
import { useUserTrackerEvent } from 'common/hooks/useUserTrackerEvent';
import Checkbox from 'commonComponents/Checkbox';
import Dropdown from 'commonComponents/Dropdown';
import { DurationMask } from 'commonComponents/DurationMask';
import { ChevronDown } from 'commonComponents/Icons/fontawesome/ChevronDown';
import { ChevronUp } from 'commonComponents/Icons/fontawesome/ChevronUp';
import { Clock } from 'commonComponents/Icons/fontawesome/Clock';
import { Xmark } from 'commonComponents/Icons/fontawesome/Xmark';
import { UnderlinedInputWrapper } from 'commonComponents/UnderlinedInputWrapper/UnderlinedInputWrapper';
import UserInput from 'commonComponents/UserInput';
import { i18mark, useTranslation } from 'i18n';
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants';
import { SumPeriod, TaskTimeEstimateInterface } from 'models/domain/TaskTimeEstimateModel/types';

import styles from './styles.css';

const DROPDOWN_OPTIONS_LABELS = {
  [SumPeriod.DAILY]: i18mark('daily'),
  [SumPeriod.TOTAL]: i18mark('total'),
};

const DROPDOWN_OPTIONS = List(Object.values(SumPeriod));

export const EstimateTooltipContent: FC<{
  color: string;
  estimate: TaskTimeEstimateInterface;
  onSave: (estimate: TaskTimeEstimateInterface) => void;
  onClear: () => void;
  onChange: (partial: Partial<TaskTimeEstimateInterface>) => void;
  onClose: () => void;
}> = ({ estimate, onSave, onClear, onClose }) => {
  const { t } = useTranslation();
  const [formEstimate, setFormEstimate] = useState(estimate);
  const { skipWeekends, sumPeriod, minutes } = formEstimate;

  useUserTrackerEvent(UserTrackerEvent.featureUsed, {
    name: 'Time Task Estimate Open',
  });

  // eslint-disable-next-line no-shadow
  const onEstimateTimeChange = (minutes: number) => {
    if (Number.isFinite(minutes)) {
      setFormEstimate({ ...formEstimate, minutes });
    }
  };

  const onSkipWeekendsChange = () => setFormEstimate({ ...formEstimate, skipWeekends: !skipWeekends });

  const onPeriodChange = (newSumPeriod: SumPeriod) => {
    setFormEstimate({ ...formEstimate, sumPeriod: newSumPeriod });
  };

  const addHour = () => setFormEstimate({ ...formEstimate, minutes: minutes + 1 || 1 });
  const subHour = () => {
    if (minutes > 0) {
      setFormEstimate({ ...formEstimate, minutes: minutes - 1 });
    }
  };

  const onClickSave = () => {
    onSave(formEstimate);
  };

  useKeyboard({
    onEnter: () => onClickSave(),
    onEsc: onClose,
  });

  return (
    <div className={styles.container}>
      <Button variant="text-reversed" className={styles.closeButton} onClick={onClose}>
        <Xmark />
      </Button>
      <p className={styles.header}>{t('TIME ESTIMATE')}</p>
      <p className={styles.subHeader}>{t('How much time will this task take?')}</p>

      <div className={styles.contentWrapper}>
        <UnderlinedInputWrapper>
          <DurationMask
            initialValue={estimate.minutes}
            onChange={onEstimateTimeChange}
            inputRenderer={({ ref, value }) => (
              <UserInput
                onSetInnerRef={(reference) => {
                  ref.current = reference;
                }}
                className={styles.input}
                labelClassName={styles.inputLabel}
                childrenClassName={styles.hourWrapper}
                value={value}
                type="text"
                placeholder={t('set time')}
                shouldFocusOnMount
              />
            )}
          >
            <div className={styles.inputControls}>
              <ButtonBase onClick={addHour} className={styles.controlButton}>
                <ChevronUp size="xxs" />
              </ButtonBase>
              <ButtonBase onClick={subHour} className={styles.controlButton}>
                <ChevronDown size="xxs" />
              </ButtonBase>
            </div>
            <Clock className={styles.clock} />
          </DurationMask>
        </UnderlinedInputWrapper>

        <Dropdown
          items={DROPDOWN_OPTIONS}
          onSelectItem={onPeriodChange}
          dropdownClassName={styles.dropdown}
          buttonRenderer={(isOpen: boolean) => (
            <Button variant="underlined" className={styles.dropdownButton}>
              {t(get(DROPDOWN_OPTIONS_LABELS, sumPeriod))}
              {isOpen ? (
                <ChevronUp className={styles.dropdownButtonIcon} />
              ) : (
                <ChevronDown className={styles.dropdownButtonIcon} />
              )}
            </Button>
          )}
          dropdownItemRenderer={(period: string) => (
            <ButtonBase key={`${period}`} className={styles.dropdownItem}>
              {t(get(DROPDOWN_OPTIONS_LABELS, period))}
            </ButtonBase>
          )}
        />
      </div>
      <span className={styles.skipWeekends}>
        <Checkbox isChecked={skipWeekends} onToggleStatus={onSkipWeekendsChange} label={t('Skip weekends')} />
      </span>

      <footer className={styles.footer}>
        <Button variant="text" onClick={onClear}>
          {t('Clear')}
        </Button>
        <Button onClick={onClickSave} disabled={!minutes}>
          {t('Save')}
        </Button>
      </footer>
    </div>
  );
};
