import { MouseEventHandler, useCallback } from 'react';

import { useDispatch } from 'react-redux';

import { useSelector } from 'common/hooks/useSelector';
import { onSetSortBy } from 'models/component/FiltersModel/actions';
import { selectSortBy } from 'models/component/FiltersModel/selectors';
import { SortOrder } from 'models/component/FiltersModel/types';

import { TaskSortControllerInterface } from '.';

export type TaskSortControllerHookInterface = {
  sortOrder: SortOrder;
  onToggleSortOrder: MouseEventHandler<HTMLDivElement>;
};

export default function useComponent(props: TaskSortControllerInterface): TaskSortControllerHookInterface {
  const sortBy = useSelector((state) => selectSortBy(state, { filterId: props.filterId }));
  const sortOrder = sortBy ? sortBy.get(props.sortKey) : null;

  const dispatch = useDispatch();

  const onToggleSortOrder = useCallback(() => {
    if (props.disableSort) {
      return;
    }

    let newSortOrder;
    switch (sortOrder) {
      case SortOrder.ASC:
        newSortOrder = SortOrder.DESC;
        break;
      case SortOrder.DESC:
        newSortOrder = null;
        break;
      default:
        newSortOrder = SortOrder.ASC;
        break;
    }
    dispatch(onSetSortBy(props.filterId, props.sortKey, newSortOrder));
  }, [dispatch, sortOrder, props.sortKey, props.filterId]);

  return {
    sortOrder,
    onToggleSortOrder,
  };
}
