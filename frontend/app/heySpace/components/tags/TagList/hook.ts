import { MouseEventHandler, useCallback, useState } from 'react';

import { List } from 'immutable';
import { useDispatch } from 'react-redux';

import useElementOpen from 'common/hooks/useElementOpen';
import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import { onTagDetach } from 'models/domain/TagsModel/actions';
import { selectTagsIdsList } from 'models/domain/TagsModel/selectors';

import { TagListInterface } from '.';

export type TagListHookInterface = {
  tagIds: List<Id>;
  shouldTruncateTags: boolean;
  isTagsPopoverOpen: boolean;
  isInputFocused: boolean;
  tagsCount: number;
  onRemoveTag: (tagId: Id) => void;
  onOpenTagsPopover: VoidFunction;
  onSetIsInputFocused: (isFocused: boolean) => void;
  onCloseTagsPopover: MouseEventHandler<HTMLDivElement | HTMLButtonElement>;
  onToggleTagsPopover: () => void;
};

export function useComponent(props: TagListInterface): TagListHookInterface {
  const dispatch = useDispatch();
  const onRemoveTag = useCallback(
    (tagId: Id) => dispatch(onTagDetach(props.objectId, tagId)),
    [dispatch, props.objectId]
  );

  const tagIds = useSelector((state) => selectTagsIdsList(state, { objectId: props.objectId }));

  const shouldTruncateTags = tagIds.size > 0 && tagIds.size - props.maxTagsToShow > 0;

  const {
    isOpen: isTagsPopoverOpen,
    onOpen: onOpenTagsPopover,
    onClose: onCloseTagsPopover,
    onToggleOpen: onToggleTagsPopover,
  } = useElementOpen();
  const [isInputFocused, onSetIsInputFocused] = useState(false);

  return {
    tagIds: shouldTruncateTags ? (tagIds.slice(0, props.maxTagsToShow) as List<Id>) : tagIds,
    shouldTruncateTags,
    isTagsPopoverOpen,
    isInputFocused,
    tagsCount: tagIds.size,
    onRemoveTag,
    onOpenTagsPopover,
    onSetIsInputFocused,
    onCloseTagsPopover,
    onToggleTagsPopover,
  };
}
