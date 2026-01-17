import createCachedSelector from 'common/node_modules/re-reselect';
import { compareItemsOrder } from 'common/utils/compareItemsOrder';
import generateSelectorName from 'common/utils/generateSelectorName';
import { Id } from 'common/utils/identifier';
import { List, Map } from 'immutable';
import createImmutableEqualSelector from '../../../../utils/createImmutableEqualSelector';
import { domain } from '../../ChecklistsModel/constants';
import { ChecklistItemInterface } from '../../ChecklistsModel/types';

const emptyList = List();
const emptyMap = Map();

export const selectChecklistsDomain = (state) => state.get(domain);

export const selectChecklistItemsData = createImmutableEqualSelector(selectChecklistsDomain, (domainData) =>
  domainData.get('checklistItemsData'),
);

export const selectChecklistsByTaskIds = createImmutableEqualSelector(selectChecklistsDomain, (domainData) =>
  domainData.get('checklistsByTaskId'),
);

export const selectChecklistItemsPeopleIds = createImmutableEqualSelector(selectChecklistsDomain, (domainData) =>
  domainData.get('checklistItemPeopleIds'),
);

export const selectTaskIdByChecklistItemIdDomain = createImmutableEqualSelector(selectChecklistsDomain, (domainData) =>
  domainData.get('taskIdByChecklistItemId'),
);

export const selectChecklistItemIdsByTaskId = createCachedSelector(
  selectChecklistsByTaskIds,
  (_, args) => args.taskId,
  (checklistsByTaskIds, taskId) => checklistsByTaskIds.get(taskId) || emptyList,
)((_, args) => generateSelectorName(args, ['taskId']));

// TODO: is that selector needed along selectChecklistItemIdsByTaskId ????
// args: taskId
export const selectChecklistItemsIdsByTaskId = createCachedSelector(
  selectChecklistItemIdsByTaskId,
  selectChecklistItemsData,
  (_, args) => args.taskId,
  (taskChecklistItemIds, checklistItemsData, taskId) => {
    let checklistItems = emptyList as List<ChecklistItemInterface>;
    taskChecklistItemIds.forEach((id) => {
      const checklistItem = checklistItemsData.get(id);
      if (checklistItem) {
        checklistItems = checklistItems.push(checklistItem);
      }
    });
    return checklistItems.sort(compareItemsOrder).map((item) => item.id);
  },
)((_, args) => generateSelectorName(args, ['taskId']));

// args: taskId
export const selectChecklistItemsDataByTaskId = createCachedSelector(
  selectChecklistItemsIdsByTaskId,
  selectChecklistItemsData,
  (taskChecklistItemsIds, checklistItemsData) =>
    taskChecklistItemsIds.reduce(
      (acc, checklistItemId) => acc.set(checklistItemId, checklistItemsData.get(checklistItemId)),
      emptyMap,
    ) as Map<Id, ChecklistItemInterface>,
)((_, args) => generateSelectorName(args, ['taskId']));

// args: taskId
export const selectTaskDoneChecklistItemIds = createCachedSelector(
  selectChecklistItemsDataByTaskId,
  (checklistItemsData) => {
    let result = emptyList as List<Id>;

    checklistItemsData.forEach((checklistItem, checklistItemId) => {
      if (checklistItem.isChecked) {
        result = result.push(checklistItemId);
      }
    });

    return result;
  },
)((_, args) => generateSelectorName(args, ['taskId']));

// args: taskId
export const selectTaskDoneChecklistItemsCount = createCachedSelector(
  selectTaskDoneChecklistItemIds,
  (doneChecklistItemIds) => doneChecklistItemIds.size,
)((_, args) => generateSelectorName(args, ['taskId']));

// args: taskId
export const selectTaskChecklistItemsCount = createCachedSelector(
  selectChecklistItemsIdsByTaskId,
  (checklistItemIds) => checklistItemIds.size,
)((_, args) => generateSelectorName(args, ['taskId']));

// args: checklistItemId
export const selectTaskIdByChecklistItemId = createCachedSelector(
  selectTaskIdByChecklistItemIdDomain,
  (_, args) => args.checklistItemId,
  (taskIdByChecklistItemId, checklistItemId) => taskIdByChecklistItemId.get(checklistItemId),
)((_, args) => generateSelectorName(args, ['checklistItemId']));

// args: checklistItemId
export const selectChecklistItemData = createCachedSelector(
  selectChecklistItemsData,
  (_, args) => args.checklistItemId,
  (checklistItemsData, checklistItemId) => checklistItemsData.get(checklistItemId),
)((_, args) => generateSelectorName(args, ['checklistItemId']));

// args: taskId
export const selectChecklistItemsOrderByTaskId = createCachedSelector(
  selectChecklistItemsDataByTaskId,
  (checklistItems) => (checklistItems ? checklistItems.map((checklistItem) => checklistItem.order) : emptyList),
)((_, args) => generateSelectorName(args, ['taskId']));

// args: checklistItemId
export const selectChecklistItemText = createCachedSelector(
  selectChecklistItemData,
  (checklistItemData) => (checklistItemData && checklistItemData.get('name')) || '',
)((_, args) => generateSelectorName(args, ['checklistItemId']));

// args: checklistItemId
export const selectChecklistItemIsChecked = createCachedSelector(selectChecklistItemData, (checklistItemData) =>
  checklistItemData ? checklistItemData.get('isChecked') : false,
)((_, args) => generateSelectorName(args, ['checklistItemId']));

// args: checklistItemId
export const selectChecklistItemWasJustCreated = createCachedSelector(selectChecklistItemData, (checklistItemData) =>
  checklistItemData ? checklistItemData.get('wasJustCreated') : false,
)((_, args) => generateSelectorName(args, ['checklistItemId']));

// args: checklistItemId
export const selectChecklistItemAssigneeIds = createCachedSelector(
  selectChecklistItemsPeopleIds,
  (_, args) => args.checklistItemId,
  (checklistItemPeopleIdsDomain, checklistItemId) => checklistItemPeopleIdsDomain.get(checklistItemId) || emptyList,
)((_, args) => generateSelectorName(args, ['checklistItemId']));
