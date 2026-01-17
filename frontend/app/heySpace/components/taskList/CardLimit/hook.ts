import {
  useState,
  KeyboardEventHandler,
  MouseEventHandler,
  useEffect,
} from 'react';

import { useDispatch } from 'react-redux';

import usePrevious from 'common/hooks/usePrevious';
import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import * as ListModelActions from 'models/domain/ListsModel/actions';
import { selectListLimit } from 'models/domain/ListsModel/selectors';
import { selectProjectColor } from 'models/domain/ProjectsModel/selectors';

import { CardLimitInterface } from '.';

interface CardLimitHookInterface {
  color: string;
  limit: number;
  onKeyDown: KeyboardEventHandler;
  onLimitChange: MouseEventHandler;
  onSaveLimit: VoidFunction;
  onRemoveLimit: VoidFunction;
}

export function useComponent({
  objectId,
  sectionId,
  onCardLimitCancelled,
  onCardLimitSaved,
}: CardLimitInterface): CardLimitHookInterface {
  const listLimit = useSelector((state) =>
    selectListLimit(state, { listId: sectionId })
  );
  const prevListLimit = usePrevious(listLimit);

  const [limit, setLimit] = useState(listLimit);

  const color = useSelector((state) =>
    selectProjectColor(state, { projectId: objectId })
  );

  const dispatch = useDispatch();

  const onSetCardLimit = (listId: Id, cardLimit: number) =>
    dispatch(ListModelActions.onSetCardLimit(listId, cardLimit));

  const onLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const onKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSaveLimit();
    } else if (event.key === 'Escape') {
      onCardLimitCancelled();
    }
  };

  const onSaveLimit = () => {
    onSetCardLimit(sectionId, limit);
    onCardLimitSaved();
  };

  const onRemoveLimit = () => {
    onSetCardLimit(sectionId, 0);
    onCardLimitSaved();
  };

  useEffect(() => {
    if (prevListLimit !== listLimit) {
      setLimit(listLimit);
    }
  }, [listLimit, prevListLimit]);

  return {
    color,
    limit,
    onLimitChange,
    onKeyDown,
    onSaveLimit,
    onRemoveLimit,
  };
}
