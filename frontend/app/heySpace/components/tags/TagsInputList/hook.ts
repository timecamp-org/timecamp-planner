import { TagInterface, TagRecordInterface } from 'common/models/domain/TagsModel/types';
import { Id } from 'common/utils/identifier';
import { List } from 'immutable';
import { KeyboardEvent, KeyboardEventHandler, Ref, useEffect, useRef, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { TagsInputInterface } from './types';
import { useDataProvider, useDataPersister } from './dataHooks';

export type TagsInputHookInterface = {
  tags: List<TagInterface>;
  hasAccessToTags: boolean;
  inputValue: string;
  tagsInputRef: Ref<HTMLDivElement>;
  onInputValueChange: (value: string) => void;
  onChange: (currentTags: List<string>) => void;
  onTagAssignAndClearInput: (name: string) => void;
  onTagAttachAndClearInput: (id: Id) => void;
  onAutosuggestKeyDown: KeyboardEventHandler;
  autosuggestListRef: Ref<Autosuggest<TagInterface>>;
  onGetSuggestedTags: (value: string) => TagInterface[];
  onTagDetach: (tagId: Id) => void;
  onTagsDetach: () => void;
  myTagsIds: Id[];
};

export function useComponent(props: TagsInputInterface): TagsInputHookInterface {
  const { tags, tagsData, hasAccessToTags } = useDataProvider(props);

  const { onTagAttach, onTagDetach, onTagAssign, onTagsDetach } = useDataPersister(props);

  const [inputValue, onSetInputValue] = useState<string>('');

  const tagsInputRef = useRef<HTMLDivElement>(null);
  const autosuggestListRef = useRef<Autosuggest<TagInterface>>(null);

  const onInputValueChange = (value: string): void => {
    onSetInputValue(value || '');
  };

  const onGetSuggestedTags = (value: string): TagRecordInterface[] => {
    return tagsData
      .filter((tag: TagRecordInterface) => tag.name.toLowerCase().indexOf(value.toLowerCase()) !== -1)
      .toArray();
  };
  const myTagsIds = tags.map((tag: TagInterface): Id => tag.id).toArray();
  const onDetachLastTag = (): void => {
    const lastTag = tags.last();

    if (lastTag) {
      onTagDetach(lastTag.id);
    }
  };

  const onAutosuggestKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.currentTarget.value === '' && event.key === 'Backspace') {
      onDetachLastTag();
    }
    if (event.key === 'Escape') {
      // @ts-ignore
      autosuggestListRef.current?.blur();
    }
  };

  const onChange = (currentTags: List<string>): void => {
    const prevSize = tags.size;
    const nextSize = currentTags.size;

    if (prevSize < nextSize) {
      const name = currentTags.last();
      onTagAssign(name);
    }
  };

  const onTagAssignAndClearInput = (name: string): void => {
    onSetInputValue('');
    onTagAssign(name);
  };

  const onTagAttachAndClearInput = (id: Id): void => {
    onSetInputValue('');
    onTagAttach(id);
  };

  const onScroll = (event: MouseEvent): void => {
    if (autosuggestListRef.current.input === document.activeElement && (event.target as Element).scrollTop > 0) {
      autosuggestListRef.current.input.blur();
    }
  };

  useEffect(() => {
    if (props.shouldFocusOnMount && tags.size === 0 && autosuggestListRef.current) {
      autosuggestListRef.current.input.focus();
      props.onSetIsFocused(true);
    }
  }, [props, tags.size]);

  useEffect(() => {
    if (tagsInputRef.current) {
      const TagsInputParentElement = tagsInputRef.current.parentElement;
      TagsInputParentElement.addEventListener('scroll', onScroll);
    }

    return () => {
      if (tagsInputRef.current) {
        const TagsInputParentElement = tagsInputRef.current.parentElement;
        TagsInputParentElement.removeEventListener('scroll', onScroll);
      }
    };
  }, []);

  return {
    tags,
    hasAccessToTags,
    inputValue,
    tagsInputRef,
    onInputValueChange,
    onChange,
    onTagAssignAndClearInput,
    onTagAttachAndClearInput,
    onAutosuggestKeyDown,
    autosuggestListRef,
    onGetSuggestedTags,
    onTagDetach,
    onTagsDetach,
    myTagsIds,
  };
}
