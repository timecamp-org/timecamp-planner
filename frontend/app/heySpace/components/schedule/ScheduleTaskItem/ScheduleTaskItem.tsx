import { FC } from 'react';

import { useSelector } from 'react-redux';

import ProjectColors from 'common/commonStyles/projectColors';
import { selectTaskColor, selectTaskName } from 'common/models/domain/TasksModel/selectors';
import { getColorWithAlpha, getShadedColor } from 'common/utils/colors';
import { getDurationHumanText, parseMinutesToDuration } from 'common/utils/duration';
import { useTranslation } from 'i18n';
import { ScheduleItem } from 'models/domain/ScheduleModel/types';
import { selectTaskTimeEstimate } from 'models/domain/TaskTimeEstimateModel/selectors';

import { FloatingTaskSummary } from '../../tasks/TaskFloatingSummary/FloatingTaskSummary';

import { TaskItem } from './TaskItem';
import { TaskItemNoAccess } from './TaskItemNoAccess';

export interface ScheduleTaskItemInterface {
  item: ScheduleItem;
  isSelected?: boolean;
  isResizeHandleVisible?: boolean;
  isCardMinimized?: boolean;
}

export const ScheduleTaskItem: FC<ScheduleTaskItemInterface> = ({
  item: { taskId, ...rest },
  isCardMinimized,
  isResizeHandleVisible,
  isSelected,
}) => {
  const { t } = useTranslation();
  const { minutesPerDay, totalWorkingDays, hasAccess, color } = {
    ...rest,
    ...useSelector((state) => selectTaskTimeEstimate(state, { taskId })),
  };

  const name = useSelector((state) => selectTaskName(state, { taskId })) || rest.name;
  const subTitle = `${getDurationHumanText(parseMinutesToDuration(minutesPerDay))}${t(
    '/d for {{ totalWorkingDays }} workdays',
    {
      totalWorkingDays,
    }
  )}`;

  const projectColor = useSelector((state) => selectTaskColor(state, { taskId }));
  const titleColor = ProjectColors.getContrastColors(projectColor)[800] || 'var(--color-gray-900)';

  const taskColor = getColorWithAlpha(color || projectColor, 0.5);

  return hasAccess ? (
    <FloatingTaskSummary id={taskId}>
      <TaskItem
        isSelected={isSelected}
        title={name}
        subTitle={subTitle}
        titleStyle={{ color: titleColor }}
        wrapperStyles={getWrapperStyles({ isSelected, color, taskColor })}
      />
    </FloatingTaskSummary>
  ) : (
    <TaskItemNoAccess subTitle={subTitle} />
  );
};

function getWrapperStyles({ color, isSelected, taskColor }: { taskColor: string; isSelected: boolean; color: string }) {
  return {
    background: taskColor,
    '--borderColor': `${isSelected ? getShadedColor(color, -20) : 'transparent'}`,
    color: taskColor,
  };
}
