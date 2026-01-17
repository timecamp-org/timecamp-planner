import { RenderSuggestionsContainerParams } from 'react-autosuggest';

import { TagInterface } from 'common/models/domain/TagsModel/types';
import styles from './styles.css';
import { SuggestedTag } from './SuggestedTag';

export const getRenderSuggestionsContainer =
  ({ onTagAssignAndClearInput, onTagAttachAndClearInput, tags, props, t }) =>
  (
    { containerProps, children, query }: RenderSuggestionsContainerParams,
    suggestions: TagInterface[]
  ): React.ReactNode => {
    const isTagAlreadyInTask = tags.filter((tag) => tag.name === query).size;
    const isTagAlreadyExists = suggestions.filter((tag) => tag.name === query).length;

    return (
      <div {...containerProps}>
        {props.isFocused ? (
          <ul className={styles.suggestionsList}>
            {suggestions.map((suggestion: TagInterface) => {
              return (
                <li
                  key={suggestion.id}
                  className={styles.suggestion}
                  onClick={() => onTagAttachAndClearInput(suggestion.id)}
                >
                  <SuggestedTag tag={suggestion} />
                </li>
              );
            })}
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
