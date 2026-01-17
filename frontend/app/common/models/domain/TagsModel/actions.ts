import * as C from './constants';
import { List, Map } from 'immutable';
import { Tag } from '../TagsModel/models';
import { ActionResultInterface } from '../ActionResultModel';
import { TagInterface, TagRecordInterface } from './types';
import { Id } from '../../../utils/identifier';
import { EntityInterface } from '../EntityModel/types';
import { action } from 'typesafe-actions';
import { getMapOfRecords } from 'common/utils/immutableUtils';

export const onInit = () => action(C.onInit);

export const onTagCreate = (tagFields: Partial<TagInterface>) => action(C.onTagCreate, tagFields);
export const onTagCreateSuccess = (actionResult: ActionResultInterface) => action(C.onTagCreateSuccess, actionResult);

export const onDeleteTag = (tagId: Id) => action(C.onDeleteTag, tagId);
export const onDeleteTagSuccess = (actionResult: ActionResultInterface) => action(C.onDeleteTagSuccess, actionResult);

export const onDeleteTagData = (wrappedEntity: EntityInterface) => action(C.onDeleteTagData, wrappedEntity.entityId);

export const onUpdateTagName = (tagId: Id, name: string) => action(C.onUpdateTagName, { tagId, name });
export const onUpdateTagColor = (tagId: Id, color: string) => action(C.onUpdateTagColor, { tagId, color });

export const onTagAttach = (objectId: Id, tagId: Id) => action(C.onTagAttach, { objectId, tagId });
export const onTagAttachSuccess = (actionResult: ActionResultInterface) => action(C.onTagAttachSuccess, actionResult);

export const onTagDetach = (objectId: Id, tagId: Id) => action(C.onTagDetach, { objectId, tagId });

export const onTagsDetach = (objectId: Id) => action(C.onTagsDetach, { objectId });
export const onTagDetachSuccess = (actionResult: ActionResultInterface) => action(C.onTagDetachSuccess, actionResult);

export const onTagAssign = (objectId: Id, name: string) => action(C.onTagAssign, { objectId, name });

export const onBatchTagsData = (tags: Partial<TagInterface[]>) => {
  const tagsData = getMapOfRecords<TagInterface, TagRecordInterface>(tags, Tag);
  return action(C.onBatchTagsData, tagsData);
};

export const onBatchTags = (tagsData: Map<Id, TagInterface>, tagIdsByObjectIds: Map<Id, List<Id>>) =>
  action(C.onBatchTags, { tagsData, tagIdsByObjectIds });

export const onCreateTagData = (tagData: EntityInterface) => action(C.onCreateTagData, Tag(tagData.body));
export const onUpdateTagData = (tagData: EntityInterface) => action(C.onUpdateTagData, Tag(tagData.body));

export const onCreateTagsByObjectId = (objectId: Id, tagsByObjectId: Id[]) =>
  action(C.onCreateTagsByObjectId, {
    objectId,
    tagsByObjectId: List(tagsByObjectId),
  });

export const onUpdateTagsByObjectId = (objectId: Id, tagsByObjectId: Id[]) =>
  action(C.onUpdateTagsByObjectId, {
    objectId,
    tagsByObjectId: List(tagsByObjectId),
  });
