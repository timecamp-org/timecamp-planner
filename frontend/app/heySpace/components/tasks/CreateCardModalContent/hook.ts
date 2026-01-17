/* eslint-disable no-shadow */
import {
  ChangeEventHandler,
  KeyboardEvent,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { List, Map } from 'immutable';

import usePrevious from 'common/hooks/usePrevious';
import { Id } from 'common/utils/identifier';
import { TaskInterface, TaskPeopleRole } from 'models/domain/TasksModel/types';

import { useDataPersister, useDataProvider } from './dataHooks';

import { CreateCardModalContentInterface } from '.';

const emptyMap = Map();

type OpenedPickerType = 'DATE' | 'USERS' | null;

export interface CreateCardModalContentHookInterface {
  name: string;
  startDate: number;
  dueDate: number;

  color: string;
  isCreateCardEnabled: boolean;
  spaceIds: List<Id>;
  listIds: List<Id>;
  selectedSpaceId: Id;
  selectedListId: Id;
  onChangeName: ChangeEventHandler;
  onCreateCard: VoidFunction;
  onSelectSpaceId: (spaceId: Id) => void;
  onSelectListId: (listId: Id) => void;
  onKeyDown: KeyboardEventHandler<HTMLDivElement>;
  onAssigneesChange: (assigneeList: List<string>) => void;
  onDateRangeChange: (dateRange: { startDate: number; dueDate: number }) => void;
  openedPickerType: OpenedPickerType;
  onSetOpenedPickerType: (openedPicker: OpenedPickerType) => void;
}

export default function useComponent(props: CreateCardModalContentInterface): CreateCardModalContentHookInterface {
  const {
    conversationUserId,
    isConversation,
    listsIsArchivedStatuses,
    projectsColor,
    spacesSections,
    spaceIds,
    currentUserId,
  } = useDataProvider(props);
  const { onTaskCreate, onCreateTaskInEmptyList, onFetchProjectListsData } = useDataPersister();
  const assignees = useRef(props.initialAssignees || List());

  let spaceId = spaceIds.first();
  if (!isConversation && props.projectId) {
    spaceId = props.projectId;
  }

  const [openedPickerType, onSetOpenedPickerType] = useState<OpenedPickerType>(null);
  const [startDate, onSetStartDate] = useState<number>(props.startDate);
  const [dueDate, onSetDueDate] = useState<number>(props.dueDate);
  const [name, onSetName] = useState('');
  const [selectedSpaceId, onSetSelectedSpaceId] = useState(spaceId);
  const [selectedListId, onSetSelectedListId] = useState(
    props?.listId || getListIds(selectedSpaceId, spacesSections, listsIsArchivedStatuses).first()
  );

  const prevStartDate = usePrevious(startDate);
  const prevDueDate = usePrevious(dueDate);

  const color = projectsColor.get(selectedSpaceId);
  const isCreateCardEnabled = !!selectedSpaceId;
  const listIds = spacesSections
    .get(selectedSpaceId)
    ?.filter((listId) => !listsIsArchivedStatuses.get(listId)) as List<string>;

  useEffect(() => {
    onFetchProjectListsData(selectedSpaceId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSpaceId]);

  useEffect(() => {
    if (props.listId && listIds?.includes(props.listId)) {
      onSetSelectedListId(props.listId);
    } else {
      onSetSelectedListId(getListIds(selectedSpaceId, spacesSections, listsIsArchivedStatuses).first());
    }
  }, [spacesSections]);

  const onAssigneesChange = (assigneeList: List<string>) => {
    assignees.current = assigneeList;
  };

  const onChangeName = useCallback(
    (event) => {
      onSetName(event.target.value);
    },
    [onSetName]
  );

  const onDateRangeChange = ({ startDate, dueDate }: { startDate: number; dueDate: number }) => {
    onSetStartDate(startDate);
    onSetDueDate(dueDate);
  };

  const onSelectSpaceId = useCallback(
    (projectId: Id) => {
      onFetchProjectListsData(projectId);
      onSetSelectedSpaceId(projectId);
      onSetSelectedListId(getListIds(projectId, spacesSections, listsIsArchivedStatuses).first());
    },
    [listsIsArchivedStatuses, spacesSections, onFetchProjectListsData]
  );

  const onSelectListId = useCallback(
    (listId) => {
      onSetSelectedListId(listId);
    },
    [onSetSelectedListId]
  );

  const onCreateCard = useCallback(() => {
    const listId = selectedListId;
    const taskFields: Partial<TaskInterface> = {
      name,
      projectId: selectedSpaceId,
      startDate,
      dueDate,
    };

    let taskPeople = emptyMap as Map<Id, TaskPeopleRole>;
    if (isConversation) {
      taskPeople = taskPeople.set(conversationUserId, TaskPeopleRole.ASSIGNEE);
    }

    if (props.shouldAutoAssign) {
      taskPeople = taskPeople.set(currentUserId, TaskPeopleRole.ASSIGNEE);
    }
    if (!listId) {
      onCreateTaskInEmptyList(taskFields, taskPeople, props.taskCreateSource);
    } else {
      taskPeople = Map(assignees.current.toJS().reduce((acc, id) => ({ ...acc, [id]: TaskPeopleRole.ASSIGNEE }), {}));
      onTaskCreate(taskFields, listId, taskPeople, props.taskCreateSource);
    }

    props.onClosePopover();
  }, [
    conversationUserId,
    startDate,
    dueDate,
    isConversation,
    name,
    selectedListId,
    selectedSpaceId,
    onCreateTaskInEmptyList,
    onTaskCreate,
    props.onClosePopover,
  ]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      switch (event.key) {
        case 'Escape':
          return props.onClosePopover();
        case 'Enter':
          return onCreateCard();
        default:
          return null;
      }
    },
    [onCreateCard, props.onClosePopover]
  );

  useEffect(() => {
    if (prevDueDate !== dueDate) {
      onSetDueDate(dueDate);
    }
    if (prevStartDate !== startDate) {
      onSetStartDate(startDate);
    }
  }, [prevDueDate, dueDate, prevStartDate, startDate]);

  return {
    name,
    startDate,
    dueDate,
    color,
    isCreateCardEnabled,
    spaceIds,
    listIds,
    selectedSpaceId,
    selectedListId,
    onChangeName,
    onDateRangeChange,
    onCreateCard,
    onSelectSpaceId,
    onSelectListId,
    onKeyDown,
    onAssigneesChange,
    openedPickerType,
    onSetOpenedPickerType,
  };
}

function getListIds(
  selectedSpaceId: Id,
  spacesSections: Map<Id, List<Id>>,
  listsIsArchivedStatuses: Map<Id, boolean>
): List<Id> {
  const spaceListIds = spacesSections?.get(selectedSpaceId) || List();

  return spaceListIds.filter((listId) => !listsIsArchivedStatuses.get(listId)) as List<Id>;
}
