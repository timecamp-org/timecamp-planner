import DueDate from 'commonComponents/DueDate';
import { CalendarDays } from 'commonComponents/Icons/fontawesome/CalendarDays';
import { PropertyButton } from 'components/buttons/PropertyButton';
import { getConditionalClass } from 'utils/getConditionalClass';
import { getDueDateFormatAndLabel } from 'utils/getDueDateFormat';

import { StartAndDueDateButtonPickerInterface } from '../StartAndDueDateButtonPicker';
import { StartAndDueDateButtonPickerHookInterface } from '../StartAndDueDateButtonPicker/hook';

import styles from './styles.css';

export function dueDateTargetRenderer(
  { onSetIsPickerOpen, isPickerOpen }: StartAndDueDateButtonPickerHookInterface,
  { dueDate }: StartAndDueDateButtonPickerInterface
) {
  const { format, label } = getDueDateFormatAndLabel(dueDate);
  const hideButton = !(dueDate || isPickerOpen);

  return (
    <PropertyButton
      className={`${styles.dueDate} ${getConditionalClass(styles.hoverChild, hideButton)}`}
      isActive={isPickerOpen}
      onClick={() => onSetIsPickerOpen(!isPickerOpen)}
      hasProperty={!!dueDate}
      icon={!dueDate && <CalendarDays size="sm" />}
    >
      {label || <DueDate format={format} dueDate={dueDate} />}
    </PropertyButton>
  );
}
