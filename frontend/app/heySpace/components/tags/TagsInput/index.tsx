import React from 'react';

import Autosuggest, { RenderSuggestionsContainerParams } from 'react-autosuggest';
import TagsInputExternal from 'react-tagsinput';

import { TagInterface } from 'common/models/domain/TagsModel/types';
import { Id } from 'common/utils/identifier';
import Tag from 'components/tags/Tag';
import { useTranslation } from 'i18n';

import 'react-tagsinput/react-tagsinput.css'; // If using WebPack and style-loader.

import { doNothing } from 'common/utils';

import { useComponent } from './hook';
import styles from './styles.css';

export type TagsInputInterface = {
  className: string;
  tagsWrapperClassName: string;
  focusedClassName: string;
  isFocused: boolean;
  shouldFocusOnMount: boolean;
  objectId: Id;
  onSetIsFocused: (arg: boolean) => void;
};

const TagsInput: React.FC<TagsInputInterface> = (props: TagsInputInterface) => {
  const {
    tags,
    inputValue,
    hasAccessToTags,
    tagsInputRef,
    onInputValueChange,
    onChange,
    onTagAssignAndClearInput,
    onTagAttachAndClearInput,
    onAutosuggestKeyDown,
    autosuggestListRef,
    onGetSuggestedTags,
    onTagDetach,
  } = useComponent(props);

  const { t } = useTranslation();

  const renderSuggestionsContainer = (
    { containerProps, children, query }: RenderSuggestionsContainerParams,
    suggestions: TagInterface[]
  ): React.ReactNode => {
    const isTagAlreadyInTask = tags.filter((tag) => tag.name === query).size;
    const isTagAlreadyExists = suggestions.filter((tag) => tag.name === query).length;

    return (
      <div {...containerProps}>
        {props.isFocused ? (
          <ul className={styles.suggestionsList}>
            {suggestions.map((suggestion: TagInterface) => (
              <li
                key={suggestion.id}
                className={styles.suggestion}
                onClick={() => onTagAttachAndClearInput(suggestion.id)}
              >
                {renderSuggestedTag(suggestion)}
              </li>
            ))}
          </ul>
        ) : null}
        {isTagAlreadyInTask && !isTagAlreadyExists ? (
          <div className={styles.suggestionsFooter}>
            <div className={styles.query}>
              {t('Tag')} <strong>{query}</strong> {t('is already in task')}
            </div>
          </div>
        ) : null}
        {query && query !== '' && !isTagAlreadyInTask && !isTagAlreadyExists && props.isFocused ? (
          <div className={styles.suggestionsFooter}>
            <div className={styles.query}>{query}</div>
            <div
              className={styles.addButton}
              onClick={() => {
                onTagAssignAndClearInput(query);
              }}
            >
              {t('ADD NEW TAG')}
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  function renderSuggestedTag(tag: TagInterface) {
    return <Tag tagId={tag.id} isDeletable={false} />;
  }

  function renderTag(data) {
    const { key } = data;
    const { id } = tags.get(key);

    return <Tag key={id} tagId={id} onRemoveTag={() => onTagDetach(id)} />;
  }

  function renderInput({ addTag, ...inputProps }): React.ReactNode {
    const suggestions = onGetSuggestedTags(inputProps.value);

    return (
      // @ts-ignore
      <Autosuggest
        ref={autosuggestListRef}
        theme={styles}
        suggestions={suggestions}
        shouldRenderSuggestions={() => suggestions.length > 0}
        getSuggestionValue={(suggestion) => suggestion.name}
        renderSuggestion={renderSuggestedTag}
        renderSuggestionsContainer={(data) => renderSuggestionsContainer(data, suggestions)}
        inputProps={{
          ...inputProps,
          onChange: inputProps.onChange,
          onFocus: () => props.onSetIsFocused(true),
          onBlur: () => props.onSetIsFocused(false),
          // @ts-ignore
          onKeyDown: (event, data) => {
            onAutosuggestKeyDown(event);
            inputProps.onKeyDown(event, data);
          },
        }}
        onSuggestionSelected={(e, { suggestion }) => {
          onTagAttachAndClearInput(suggestion.id);
        }}
        onSuggestionsClearRequested={doNothing}
        onSuggestionsFetchRequested={doNothing}
      />
    );
  }

  return (
    <div
      ref={tagsInputRef}
      className={props.tagsWrapperClassName}
      onKeyDownCapture={(event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
        }
      }}
    >
      <TagsInputExternal
        className={props.className}
        focusedClassName={props.focusedClassName}
        value={tags.map((tag) => tag.name)}
        inputValue={inputValue}
        onlyUnique={true}
        onChangeInput={onInputValueChange}
        onChange={onChange}
        renderTag={renderTag}
        renderInput={renderInput}
        disabled={!hasAccessToTags}
        inputProps={{
          placeholder: t('Add a tag...'),
        }}
      />
    </div>
  );
};

TagsInput.defaultProps = {
  shouldFocusOnMount: true,
  isFocused: false,
  objectId: '',
  onSetIsFocused: doNothing,
};

export default TagsInput;
