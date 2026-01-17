import { Id } from '../../../utils/identifier';
import { Map, List, OrderedMap } from 'immutable';
import { ImmutableMap } from '../../../types';
import { TypedRecord } from 'typed-immutable-record';
export interface TagInterface {
  id: Id;
  name: string;
  color: string;
  organizationId: Id;
}

export interface TagRecordInterface extends TypedRecord<TagRecordInterface>, TagInterface {}

export type TagsData = Map<Id, TagRecordInterface>;

export interface TagsState extends ImmutableMap<string, any> {
  tagsData: TagsData;
  tagsByObjectId: TagsByObjectId;
}

export type TagsByObjectId = Map<Id, List<Id>>;

export interface GroupedTagsByLetterInterface extends Map<string, any> {
  firstLetter: string;
  tagsTaskIds: List<TagTaskIds>;
}

export interface TagTaskIds extends Map<string, any> {
  tagId: Id;
  taskIds: List<Id>;
}

export type TagsByLetter = [string, OrderedMap<Id, List<Id>>];

export type TaskIdsByTagIds = [Id, List<Id>];

export type ParsedTagsInterface = {
  tagsData: Map<Id, TagInterface>;
  tagIdsByObjectIds: Map<Id, List<Id>>;
};
