import { FC } from 'react';

import { Id } from 'common/utils/identifier';
import StartAndDueDateButtonPicker, {
  StartAndDueDateButtonPickerInterface,
} from 'components/tasks/StartAndDueDateButtonPicker';

import { useDataPersister, useDataProvider } from './dataHooks';

export interface CardStartAndDueDateControllerInterface extends StartAndDueDateButtonPickerInterface {
  taskId: Id;
}

const CardStartAndDueDateController: FC<CardStartAndDueDateControllerInterface> = ({
  taskId,
  targetClassName,
  format,
  placeholder,
  targetRenderer,
}) => {
  const { color, dueDate, startDate } = useDataProvider(taskId);
  const { onTaskUpdate } = useDataPersister(taskId);

  return (
    <StartAndDueDateButtonPicker
      color={color}
      dueDate={dueDate}
      startDate={startDate}
      onDateRangeChange={onTaskUpdate}
      targetClassName={targetClassName}
      format={format}
      placeholder={placeholder}
      targetRenderer={targetRenderer}
    />
  );
};

export default CardStartAndDueDateController;
