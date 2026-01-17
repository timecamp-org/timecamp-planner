import Autosuggest from 'react-autosuggest';

import { doNothing } from 'common/utils';

import styles from './styles.css';
import { SuggestedTag } from './SuggestedTag';
import { getRenderSuggestionsContainer } from './SuggestionContainer';

export const renderInput =
  ({
    autosuggestListRef,
    onGetSuggestedTags,
    onAutosuggestKeyDown,
    onTagAttachAndClearInput,
    onTagAssignAndClearInput,
    props,
    tags,
    t,
  }) =>
    ({ addTag, ...inputProps }) => {
      const suggestions = onGetSuggestedTags(inputProps.value);

      const renderSuggestionContainer = getRenderSuggestionsContainer({
        onTagAssignAndClearInput,
        onTagAttachAndClearInput,
        tags,
        props,
        t,
      });

      return (
        // @ts-ignore
        <Autosuggest
          ref={autosuggestListRef}
          theme={styles}
          suggestions={suggestions}
          shouldRenderSuggestions={() => suggestions.length > 0}
          getSuggestionValue={(suggestion) => suggestion.tag.name}
          renderSuggestion={SuggestedTag}
          renderSuggestionsContainer={(data) => renderSuggestionContainer(data, suggestions)}
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
            onTagAttachAndClearInput(suggestion.tag.id);
          }}
          onSuggestionsClearRequested={doNothing}
          onSuggestionsFetchRequested={doNothing}
        />
      );
    };
