import { FC, useState } from 'react';

import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import PopoverContent from 'commonComponents/PopoverContent';
import UniversalPopover from 'commonComponents/UniversalPopover';
import { selectTaskPriorityType } from 'models/domain/TasksModel/selectors';
import { TaskPriorityTypes } from 'models/domain/TasksModel/types';

import { FigmaIconSizeProp } from 'app/heySpace/theme/types';
import TaskPrioritiesList from '../TaskPrioritiesList/TaskPrioritiesList';
import TaskPriorityFlag from '../TaskPriorityFlag/TaskPriorityFlag';

interface TaskPrioritiesPickerInterface {
  size?: FigmaIconSizeProp;
  taskId: Id;
  grayscale?: boolean;
  hideBorder?: boolean;
  className?: string;
  targetRenderer?: (props: {
    priorityType: TaskPriorityTypes;
    onClick: VoidFunction;
    isPopoverOpened: boolean;
  }) => JSX.Element;
}

const popperModifiers = {
  offset: {
    offset: `1, 16`,
  },
  preventOverflow: {
    boundariesElement: 'window',
  },
};

const TaskPrioritiesPicker: FC<TaskPrioritiesPickerInterface> = ({
  taskId,
  size,
  grayscale = false,
  hideBorder = false,
  targetRenderer,
  className,
}) => {
  const [isPopoverOpened, setIsPopoverOpened] = useState(false);
  const priorityType = useSelector((state) => selectTaskPriorityType(state, { taskId }));

  const onToggleOpen = () => setIsPopoverOpened(!isPopoverOpened);
  const onClose = () => setIsPopoverOpened(false);

  const Target = targetRenderer?.({ isPopoverOpened, priorityType, onClick: onToggleOpen }) ?? (
    <TaskPriorityFlag
      priorityType={priorityType}
      onClick={onToggleOpen}
      size={size}
      grayscale={grayscale}
      hideBorder={hideBorder}
      className={className}
    />
  );

  return (
    <PopoverContent isVisible={isPopoverOpened} onClickOutside={onClose}>
      <UniversalPopover
        isPopoverOpened={isPopoverOpened}
        targetComponent={Target}
        popperPlacement={'bottom'}
        popperComponent={<TaskPrioritiesList taskId={taskId} onClose={onClose} />}
        popperModifiers={popperModifiers}
      />
    </PopoverContent>
  );
};

export default TaskPrioritiesPicker;
