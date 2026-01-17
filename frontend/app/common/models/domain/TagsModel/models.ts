import { TagInterface, TagRecordInterface } from './types';
import { makeTypedFactory } from 'typed-immutable-record';

const defaultTag: TagInterface = {
  id: undefined,
  name: '',
  color: '',
  organizationId: undefined,
}

export const Tag = makeTypedFactory<
  TagInterface | TagRecordInterface,
  TagRecordInterface
>
  (defaultTag)
