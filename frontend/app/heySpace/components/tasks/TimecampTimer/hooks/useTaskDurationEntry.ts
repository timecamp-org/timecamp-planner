import format from 'date-fns/format';
import { useDispatch, useSelector } from 'react-redux';

import * as RequestTypesConstants from 'models/domain/RequestModel/constants/requestTypes';
import { selectRequestIsLoading } from 'models/domain/RequestModel/selectors';
import { onAddTimeEntry } from 'models/domain/Timecamp/actions';

const dateFormat = 'YYYY-MM-DD';
export const useTaskDurationEntry = (taskId: string) => {
  const dispatch = useDispatch();

  const addDurationEntry = ({ date, durationSeconds }: { date: Date; durationSeconds: number }) => {
    dispatch(
      onAddTimeEntry({
        taskId,
        duration: durationSeconds,
        date: format(date, dateFormat),
      })
    );
  };

  const isLoading = useSelector((state) =>
    selectRequestIsLoading(state, { requestType: RequestTypesConstants.addTimeEntry, objectId: taskId })
  );

  return {
    addDurationEntry,
    isLoading,
  };
};
