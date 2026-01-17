/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-shadow */
import { useCallback } from 'react';

import { eachDay, endOfDay, startOfDay } from 'date-fns';
import { List } from 'immutable';
import uniq from 'lodash/uniq';
import { TimelineGroupBase, TimelineItemBase } from 'react-calendar-timeline';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { useSelector } from 'common/hooks/useSelector';
import { selectFilterByProperty } from 'common/models/component/FiltersModel/selectors';
import { TaskFiltersTargetType } from 'common/models/component/FiltersModel/types';
import { makeFilterId } from 'common/models/component/FiltersModel/utils';
import { ProjectTasksMetadataType } from 'common/models/domain/ProjectsModel/types';
import { ProjectTasksQueryParams } from 'common/models/domain/RequestModel/types';
import { TaskStatusFilterType, TaskTimelineItem } from 'common/models/domain/TasksModel/types';
import { selectCurrentUserId } from 'common/models/domain/UsersModel/selectors/domain';
import { Id } from 'common/utils/identifier';
import { PeriodDurationType } from 'common/utils/timeIntervalDefinitions';
import * as AppModelActions from 'models/domain/AppModel/actions';
import {
  selectConversationIdByProjectId,
  selectDirectChatPartner,
  selectProjectIsGroupOrDirectChat,
} from 'models/domain/ProjectsModel/selectors';
import * as RequestModelActions from 'models/domain/RequestModel/actions';
import { onMoveTaskTimespan, onResizeTaskTimePeriod } from 'models/domain/TasksModel/actions';
import {
  selectProjectTasksSortedByUser,
  selectProjectTimelineTaskItems,
  selectUserAssignedTimelineTaskItems,
} from 'models/domain/TasksModel/selectors/timelineSelectors';
import { onUpdateViewSettingsBody as onUpdateViewSettingsBodyAction } from 'models/domain/ViewSettingsModel/actions';
import { selectViewSettingsBodyField } from 'models/domain/ViewSettingsModel/selectors/domain';
import { ViewSettingsBodyType } from 'models/domain/ViewSettingsModel/types';

import { ProjectPanelType } from '../../../../../common/models/domain/ProjectsSettingsModel/types';
import { ResizeEdgeType } from '../../../common/Timeline/types';

import { SpaceTimelineInterface } from './index';

export type DataProviderHookInterface = {
  items: List<TimelineItemBase<number>>;
  groups: TimelineGroupBase[];
  visibleTimeStart: number;
  visibleTimeEnd: number;
  visiblePeriodDurationType: PeriodDurationType;
  fetchArchived: boolean;
  isConversation: boolean;
};

export const useDataProvider = (props: SpaceTimelineInterface): DataProviderHookInterface => {
  const { viewId, spaceId } = props;
  const { projectPanelType } = useParams<{
    projectPanelType: ProjectPanelType;
  }>();
  const currentUserId = useSelector((state) => selectCurrentUserId(state));
  const targetType = props.shouldMergeFiltersWithParent ? props.containerType : TaskFiltersTargetType.TIMELINE;
  const filterId = makeFilterId(currentUserId, targetType, spaceId);
  const taskStatusFilter = useSelector((state) => selectFilterByProperty(state, { filterId, property: 'status' }));
  const fetchArchived = taskStatusFilter === TaskStatusFilterType.ARCHIVED;
  const isConversation = useSelector((state) => selectProjectIsGroupOrDirectChat(state, { projectId: spaceId }));

  const conversationId = useSelector((state) => selectConversationIdByProjectId(state, { projectId: spaceId }));
  const conversationPartner = useSelector((state) => selectDirectChatPartner(state, { conversationId }));
  const visibleTimeStart = useSelector((state) =>
    selectViewSettingsBodyField(state, {
      viewId,
      fieldName: 'visibleTimeStart',
    })
  );
  const visibleTimeEnd = useSelector((state) =>
    selectViewSettingsBodyField(state, {
      viewId,
      fieldName: 'visibleTimeEnd',
    })
  );
  const visiblePeriodDurationType = useSelector((state) =>
    selectViewSettingsBodyField(state, {
      viewId,
      fieldName: 'visiblePeriodDurationType',
    })
  );

  const [items, groups] = useSelector((state) => {
    if (isConversation) {
      const items = selectUserAssignedTimelineTaskItems(state, {
        userId: isConversation ? conversationPartner || currentUserId : spaceId,
        filterId,
        viewId,
      });

      return [items, getGroups(items, props.spaceId, isConversation)];
    } else if (projectPanelType === ProjectPanelType.TIMELINE_PEOPLE) {
      const { timelineItems, userGroups } = selectProjectTasksSortedByUser(state, {
        projectId: spaceId,
        filterId,
        viewId,
      });

      return [timelineItems as List<TaskTimelineItem>, userGroups];
    } else if (projectPanelType === ProjectPanelType.TIMELINE_PROJECT) {
      const items = selectProjectTimelineTaskItems(state, {
        projectId: spaceId,
        filterId,
        viewId,
      });

      const dayMarkerItems = getDateMarkerItems({
        projectId: spaceId,
        group: spaceId,
        timeStart: visibleTimeStart,
        timeEnd: visibleTimeEnd,
      });

      return [items as List<TaskTimelineItem>, getGroups(items, props.spaceId, isConversation)];
    }
  });

  return {
    items,
    groups,
    isConversation,
    visibleTimeStart,
    visibleTimeEnd,
    visiblePeriodDurationType,
    fetchArchived,
  };
};

export type DataPersisterHookInterface = {
  onMoveCardInTimeline: (cardId: Id, startTimestamp: number, ignoreDebounce?: boolean) => void;
  onResizeItem: (cardId: Id, timestamp: number, edge: ResizeEdgeType) => void;
  onUpdateViewSettings: (settings: Partial<ViewSettingsBodyType>) => void;
  onOpenCardDetailsModal: (cardId: Id) => void;
  onFetchProjectTasksData: (visibleTimeStart: number, visibleTimeEnd: number, fetchArchived?: boolean) => void;
};

export const useDataPersister = (props: SpaceTimelineInterface): DataPersisterHookInterface => {
  const dispatch = useDispatch();

  const onResizeItem = useCallback(
    (cardId: Id, timestamp: number, edge: ResizeEdgeType) => {
      dispatch(onResizeTaskTimePeriod(cardId, timestamp, edge));
    },
    [dispatch]
  );

  const onMoveCardInTimeline = useCallback(
    (cardId: Id, startTimestamp: number, ignoreDebounce = false) => {
      dispatch(onMoveTaskTimespan(cardId, startTimestamp, ignoreDebounce));
    },
    [dispatch]
  );

  const onUpdateViewSettings = useCallback(
    (settings: Partial<ViewSettingsBodyType>) => {
      dispatch(onUpdateViewSettingsBodyAction(props.viewId, settings));
    },
    [dispatch, props.viewId]
  );

  const onOpenCardDetailsModal = useCallback(
    (cardId: Id) => {
      dispatch(AppModelActions.onSetOpenedCardDetailsModalId(cardId));
    },
    [dispatch]
  );

  const onFetchProjectTasksData = useCallback(
    (visibleTimeStart: number, visibleTimeEnd: number, fetchArchived: boolean = false) => {
      const queryParams = generateProjectTimelineQueryParams(visibleTimeStart, visibleTimeEnd, fetchArchived);
      dispatch(RequestModelActions.onFetchProjectTasksData(props.spaceId, queryParams));
    },
    [dispatch, props.spaceId]
  );

  return {
    onResizeItem,
    onMoveCardInTimeline,
    onUpdateViewSettings,
    onOpenCardDetailsModal,
    onFetchProjectTasksData,
  };
};

const projectTimelineMetadata = [
  ProjectTasksMetadataType.PEOPLE,
  ProjectTasksMetadataType.TAGS,
  ProjectTasksMetadataType.CHECKLIST,
];

export function generateProjectTimelineQueryParams(
  visibleTimeStart: number,
  visibleTimeEnd: number,
  fetchArchived: boolean = false
): ProjectTasksQueryParams {
  return {
    fetchArchived,
    before: visibleTimeEnd,
    since: visibleTimeStart,
    metadata: projectTimelineMetadata,
  };
}

function getGroups(items: List<TimelineItemBase<number>>, spaceId: Id, isConversation: boolean): TimelineGroupBase[] {
  if (!isConversation || items.size === 0) {
    return [{ id: spaceId, title: spaceId }];
  }
  const groupIds = uniq(items.map((item) => item.group).toArray());

  const groupObjects: TimelineGroupBase[] = [];
  groupIds.forEach((groupId) => {
    groupObjects.push({ id: groupId, title: spaceId });
  });

  return groupObjects;
}

function getDateMarkerItems({
  assigneeId,
  timeEnd,
  timeStart,
  group,
  projectId,
}: {
  timeStart: number;
  timeEnd: number;
  group?: string;
  assigneeId?: string;
  projectId: string;
}) {
  const visibleDays: Date[] = eachDay(timeStart, timeEnd);

  return visibleDays.map<TaskTimelineItem>((date) => getDayItem({ date, assigneeId, group, projectId }));
}

interface TimelineDayMarkerItemInterface extends TaskTimelineItem {
  assigneeId?: string;
  projectId: string;
  isEditable?: boolean;
}

function getDayItem({
  date,
  group,
  assigneeId,
  projectId,
}: {
  date: Date;
  group: string;
  assigneeId?: string;
  projectId: string;
}): TimelineDayMarkerItemInterface {
  return {
    assigneeId,
    projectId,
    start_time: startOfDay(date).getTime(),
    end_time: endOfDay(date).getTime(),
    group,
    taskId: '',
    id: `${date}`,
    canChangeGroup: false,
    canMove: false,
    canResize: false,
    isEditable: false,
  };
}
