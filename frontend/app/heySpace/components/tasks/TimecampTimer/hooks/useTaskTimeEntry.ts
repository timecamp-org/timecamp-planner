import format from 'date-fns/format';
import { useDispatch, useSelector } from 'react-redux';

import * as RequestTypesConstants from 'models/domain/RequestModel/constants/requestTypes';
import { selectRequestIsLoading } from 'models/domain/RequestModel/selectors';
import { onAddTimeEntry } from 'models/domain/Timecamp/actions';

const timeFormat = 'YYYY-MM-DD HH:mm';

export const useTaskTimeEntry = (taskId: string) => {
  const dispatch = useDispatch();

  const addTimeEntry = ({ from, to }: { from: Date; to: Date }) => {
    dispatch(
      onAddTimeEntry({
        taskId,
        from: format(from, timeFormat),
        to: format(to, timeFormat),
      })
    );
  };

  const isLoading = useSelector((state) =>
    selectRequestIsLoading(state, { requestType: RequestTypesConstants.addTimeEntry, objectId: taskId })
  );

  return {
    addTimeEntry,
    isLoading,
  };
};
