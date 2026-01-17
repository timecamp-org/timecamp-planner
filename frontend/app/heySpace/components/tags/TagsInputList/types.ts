import { Id } from 'common/utils/identifier';

export type TagsInputInterface = {
  className: string;
  tagsWrapperClassName: string;
  focusedClassName: string;
  isFocused: boolean;
  shouldFocusOnMount: boolean;
  objectId: Id;
  onSetIsFocused: (arg: boolean) => void;
};
