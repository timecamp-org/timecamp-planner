import { MouseEventHandler, useCallback } from 'react';

import { useDispatch } from 'react-redux';

import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import { onUpdateViewSettingsBody } from 'models/domain/ViewSettingsModel/actions';
import { selectViewSettingsBodyField } from 'models/domain/ViewSettingsModel/selectors/domain';

import { getNewTimeBounds } from '../timeline/helpers';

export type GoToTodayButtonHookInterface = {
  onClick: MouseEventHandler;
};

export default function useComponent(viewId: Id): GoToTodayButtonHookInterface {
  const dispatch = useDispatch();

  const visiblePeriodDurationType = useSelector((state) =>
    selectViewSettingsBodyField(state, { viewId, fieldName: 'visiblePeriodDurationType' })
  );

  const onClick = useCallback(() => {
    const { timeStart, timeEnd } = getNewTimeBounds(visiblePeriodDurationType);
    dispatch(
      onUpdateViewSettingsBody(viewId, {
        visibleTimeStart: timeStart,
        visibleTimeEnd: timeEnd,
      })
    );
  }, [dispatch, viewId, visiblePeriodDurationType]);

  return {
    onClick,
  };
}
