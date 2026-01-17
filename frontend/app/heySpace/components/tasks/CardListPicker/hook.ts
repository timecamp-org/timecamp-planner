import { Id } from 'common/utils/identifier';
import { List } from 'immutable';
import { useDataPersister, useDataProvider } from './dataHooks';
import useElementOpen from 'common/hooks/useElementOpen';
import { useCallback } from 'react';
import { CardListPickerInterface } from '.';

export type CardListPickerHookInterface = {
  listId: Id;

  listIds: List<Id>;
  projectColor: string;
  isGetProjectViewDataSuccess: boolean;

  isSectionPickerVisible: boolean;

  onClickSectionName: VoidFunction;
  onChangeSection: (listId: Id) => void;
  onHideAllPickers: VoidFunction;
  listsData: { id: Id; name: string }[];
};

export default function useComponent(props: CardListPickerInterface): CardListPickerHookInterface {
  const {
    listId,
    projectId,
    listIds,
    projectColor,
    isGetProjectViewDataSuccess,
    isGetProjectViewDataRepeatable,
    listsData,
  } = useDataProvider(props.taskId);

  const { onFetchProjectViewData, onMoveTask } = useDataPersister();

  const { isOpen: isSectionPickerVisible, onSetIsOpen: onSetIsSectionPickerVisible } = useElementOpen();

  const onClickSectionName = useCallback(() => {
    if (isGetProjectViewDataRepeatable) {
      onFetchProjectViewData(projectId);
    }
    onSetIsSectionPickerVisible(true);
  }, [projectId, isGetProjectViewDataRepeatable, onSetIsSectionPickerVisible, onFetchProjectViewData]);

  const onHideAllPickers = useCallback(() => {
    onSetIsSectionPickerVisible(false);
  }, [onSetIsSectionPickerVisible]);

  const onChangeSection = useCallback(
    (destinationSectionId: Id) => {
      onHideAllPickers();
      onMoveTask(props.taskId, undefined, destinationSectionId, projectId, projectId);
    },
    [onHideAllPickers, onMoveTask, props.taskId, projectId]
  );

  return {
    listId,
    listIds,
    projectColor,
    isGetProjectViewDataSuccess,
    isSectionPickerVisible,
    onChangeSection,
    onClickSectionName,
    onHideAllPickers,
    listsData,
  };
}
