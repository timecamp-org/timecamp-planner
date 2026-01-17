import { FC, useState } from 'react';

import { useSelector } from 'react-redux';

import { i18n } from 'common/i18n';
import { parseMinutesToDuration } from 'common/utils/duration';
import { Id } from 'common/utils/identifier';
import PopoverContent from 'commonComponents/PopoverContent';
import UniversalPopover from 'commonComponents/UniversalPopover';
import { selectTaskColor } from 'models/domain/TasksModel/selectors';
import { SumPeriod, TaskTimeEstimateInterface } from 'models/domain/TaskTimeEstimateModel/types';

import { EstimateTooltipContent } from './EstimateTooltipContent';
import { useTaskTimeEstimate } from './hook';
import { ToggleTooltipButton } from './ToggleTooltipButton';

const POPPER_MODIFIERS = {
  offset: {
    offset: '0, 10',
  },
};

const getEstimateButtonText = (estimate?: TaskTimeEstimateInterface) => {
  if (!estimate) {
    return;
  }

  const t = i18n?.t.bind(i18n);
  const { sumPeriod } = estimate;
  const { hours, minutes } = parseMinutesToDuration(estimate.minutes);
  const postfix = sumPeriod === SumPeriod.DAILY ? `/${t('d')}` : '';

  // eslint-disable-next-line consistent-return
  return `${hours ? `${hours}${t('h')}` : ''} ${minutes ? `${minutes}${t('m')}` : ''}${postfix}`;
};

interface TaskEstimatesInterface {
  taskId: Id;
  toggleButtonClass?: string;
  hideOnEmpty?: boolean;
  size?: 'sm' | 'xs' | 'xxs';
}

export const TaskEstimates: FC<TaskEstimatesInterface> = ({ taskId, toggleButtonClass, hideOnEmpty, size }) => {
  const { estimate, onChange, onSave, onResetState, onClear, initialEstimate } = useTaskTimeEstimate(taskId);
  const [isOpen, setIsOpen] = useState(false);
  const color = useSelector((state) => selectTaskColor(state, { taskId }));

  if (hideOnEmpty && !estimate?.minutes) {
    return null;
  }

  const onToggleButtonClick = () => setIsOpen(!isOpen);

  const onClose = () => {
    setIsOpen(false);
    onResetState();
  };

  const onSaveAndClose = (newEstimate: TaskTimeEstimateInterface) => {
    setIsOpen(false);
    onSave(newEstimate);
  };

  const onClearAndClose = () => {
    setIsOpen(false);
    onClear();
  };

  return (
    <PopoverContent onClickOutside={onClose} isVisible={isOpen}>
      <UniversalPopover
        popperComponent={
          <EstimateTooltipContent
            color={color}
            estimate={estimate}
            onChange={onChange}
            onSave={onSaveAndClose}
            onClear={onClearAndClose}
            onClose={onClose}
          />
        }
        targetComponent={
          <ToggleTooltipButton
            isActive={isOpen}
            color={color}
            onClick={onToggleButtonClick}
            hasEstimate={!!estimate.minutes}
            className={toggleButtonClass}
            size={size}
          >
            {getEstimateButtonText(initialEstimate)}
          </ToggleTooltipButton>
        }
        isPopoverOpened={isOpen}
        popperPlacement="bottom"
        popperModifiers={POPPER_MODIFIERS}
      />
    </PopoverContent>
  );
};
