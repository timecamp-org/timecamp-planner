import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import { selectTaskChecklistItemsCount } from 'models/domain/ChecklistsModel/selectors/domain';
import { selectTaskColor, selectTaskProgressEstimate } from 'models/domain/TasksModel/selectors';

export type TimelineCardHookInterface = {
  cardColor: string;
  taskChecklistItemCount: number;
  taskProgress: number;
};

export default function useComponent(cardId: Id): TimelineCardHookInterface {
  const cardColor = useSelector((state) => selectTaskColor(state, { taskId: cardId }));
  const taskChecklistItemCount = useSelector((state) => selectTaskChecklistItemsCount(state, { taskId: cardId }));
  const taskProgress = useSelector((state) => selectTaskProgressEstimate(state, { taskId: cardId }));

  return {
    cardColor,
    taskChecklistItemCount,
    taskProgress,
  };
}
