import { useState, Dispatch, SetStateAction } from 'react';
import { Id } from 'common/utils/identifier';
import { List } from 'immutable';
import { useDataPersister, useDataProvider } from './dataHooks';
import useElementOpen from 'common/hooks/useElementOpen';
import { useCallback } from 'react';
import { CardSpacePickerInterface } from '.';

export type CardSpacePickerHookInterface = {
  projectId: Id;

  spaceIds: List<Id>;
  projectColor: string;
  isGetProjectViewDataSuccess: boolean;

  isProjectPickerVisible: boolean;

  onClickProjectName: VoidFunction;
  onChangeSpace: (destinationSpaceId: Id) => void;
  onHideAllPickers: VoidFunction;
  onSetSearchFilter: Dispatch<SetStateAction<string>>;
};

export default function useComponent(props: CardSpacePickerInterface): CardSpacePickerHookInterface {
  const [searchFilter, onSetSearchFilter] = useState<string>('');
  const { projectId, spaceIds, projectColor, isGetProjectViewDataSuccess } = useDataProvider(
    props.taskId,
    searchFilter
  );

  const { onMoveTask } = useDataPersister();

  const { isOpen: isProjectPickerVisible, onSetIsOpen: onSetIsProjectPickerVisible } = useElementOpen();

  const onClickProjectName = useCallback(() => {
    onSetIsProjectPickerVisible(true);
  }, [onSetIsProjectPickerVisible]);

  const onHideAllPickers = useCallback(() => {
    onSetIsProjectPickerVisible(false);
  }, [onSetIsProjectPickerVisible]);

  const onChangeSpace = useCallback(
    (destinationSpaceId: Id) => {
      onHideAllPickers();
      onMoveTask(props.taskId, undefined, undefined, projectId, destinationSpaceId, false);
    },
    [onHideAllPickers, onMoveTask, props.taskId, projectId]
  );

  return {
    projectId,
    spaceIds,
    projectColor,
    isGetProjectViewDataSuccess,
    isProjectPickerVisible,
    onChangeSpace,
    onClickProjectName,
    onHideAllPickers,
    onSetSearchFilter,
  };
}
