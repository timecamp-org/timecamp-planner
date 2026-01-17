import {
  useCallback,
  useState,
  ChangeEvent,
  ChangeEventHandler,
  KeyboardEventHandler,
  KeyboardEvent,
  useRef,
  useEffect,
  MouseEventHandler,
  MouseEvent,
} from 'react';

import { List } from 'immutable';
import debounce from 'lodash/debounce';
import { useParams } from 'react-router';

import useElementOpen from 'common/hooks/useElementOpen';
import usePrevious from 'common/hooks/usePrevious';
import { toggleDebounceTime } from 'common/utils/debounceTimes';
import { Id } from 'common/utils/identifier';
import { UserProjectGroupInterface } from 'models/domain/PersonalProjectStructureModel/types';

import { useDataProvider, useDataPersister } from './dataHooks';

import { SpaceGroupInterface } from '.';

export type SpaceGroupHookInterface = {
  name: string;
  isExpanded: boolean;
  spaceIds: List<Id>;
  groupHasUnreadMessages: boolean;
  isOptionsOpen: boolean;
  isInputOpen: boolean;
  localGroupName: string;
  onToggleExpand: VoidFunction;
  onCloseOptions: VoidFunction;
  onToggleIsOptionsOpen: MouseEventHandler<HTMLDivElement>;
  onDeleteGroup: MouseEventHandler<HTMLButtonElement>;
  onOpenGroupInput: MouseEventHandler<HTMLButtonElement>;
  onChangeGroupName: ChangeEventHandler;
  onInputKeyDown: KeyboardEventHandler;
  onSaveGroupName: VoidFunction;
  isSelected: (spaceId: Id) => boolean;
};

export default function useComponent({
  groupId,
}: SpaceGroupInterface): SpaceGroupHookInterface {
  const {
    isExpanded,
    groupName,
    spaceIds,
    groupHasUnreadMessages,
    wasJustCreated,
  } = useDataProvider(groupId);

  const prevIsExpanded = usePrevious(isExpanded);

  const dataPersister = useDataPersister(groupId);

  const debouncedOnUpdateProjectGroup = useRef(
    debounce(
      (fields: Partial<UserProjectGroupInterface>) =>
        dataPersister.onUpdateProjectGroup(fields),
      toggleDebounceTime
    )
  );

  const {
    isOpen: isOptionsOpen,
    onToggleOpen: onToggleIsOptionsOpenLocal,
    onClose: onCloseOptions,
  } = useElementOpen();

  const onToggleIsOptionsOpen = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
      onToggleIsOptionsOpenLocal();
    },
    [onToggleIsOptionsOpenLocal]
  );

  const onDeleteGroup = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
      debouncedOnUpdateProjectGroup.current.cancel();
      dataPersister.onDeleteGroup();
    },
    [dataPersister.onDeleteGroup]
  );

  const {
    isOpen: isInputOpen,
    onOpen: onOpenInput,
    onClose: onCloseInput,
  } = useElementOpen(wasJustCreated);

  const [localGroupName, onSetGroupName] = useState(groupName);
  const [localIsExpanded, onSetIsExpanded] = useState(isExpanded);

  const onChangeGroupName = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onSetGroupName(event.target.value);
    },
    []
  );

  const onSaveGroupName = useCallback(() => {
    onCloseInput();
    if (localGroupName !== groupName) {
      dataPersister.onUpdateProjectGroup({ name: localGroupName });
    }
  }, [
    localGroupName,
    groupName,
    dataPersister.onUpdateProjectGroup,
    onCloseInput,
    ,
  ]);

  const onInputKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        onSaveGroupName();
      }
    },
    [onSaveGroupName]
  );

  const onOpenGroupInput = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
      onOpenInput();
      onCloseOptions();
    },
    [onOpenInput, onCloseOptions]
  );

  const onToggleExpand = useCallback(() => {
    debouncedOnUpdateProjectGroup.current({ isExpanded: !localIsExpanded });
    onSetIsExpanded(!localIsExpanded);
  }, [localIsExpanded, debouncedOnUpdateProjectGroup]);

  useEffect(() => {
    if (isExpanded !== prevIsExpanded) {
      onSetIsExpanded(isExpanded);
    }
  }, [isExpanded, prevIsExpanded]);

  const { projectId: currentProjectId } = useParams<{ projectId: string }>();

  const isSelected = useCallback(
    (spaceId: Id) => spaceId === currentProjectId,
    [currentProjectId]
  );

  return {
    name: groupName,
    isExpanded: localIsExpanded,
    spaceIds,
    groupHasUnreadMessages,
    isOptionsOpen,
    isInputOpen,
    localGroupName,
    onToggleIsOptionsOpen,
    onCloseOptions,
    onOpenGroupInput,
    onToggleExpand,
    onDeleteGroup,
    onChangeGroupName,
    onSaveGroupName,
    onInputKeyDown,
    isSelected,
  };
}
