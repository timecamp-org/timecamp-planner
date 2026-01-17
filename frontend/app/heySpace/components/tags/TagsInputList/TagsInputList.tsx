import { FC, useEffect, useRef, useState } from 'react';

import { Box, Button, Divider, SxProps } from '@mui/material';
import fuzzysearch from 'fuzzysearch';

import { doNothing } from 'common/utils';
import { Add } from 'commonComponents/Icons/fontawesome/Add';
import InputIcon from 'commonComponents/InputIcon';
import { useTranslation } from 'i18n';

import { useComponent } from './hook';
import styles from './styles.css';
import TagsList from './TagsList';
import { TagsInputInterface } from './types';

const dividerStyles: SxProps = {
  margin: '1rem',
};

const TagsInputList: FC<Partial<TagsInputInterface>> = (props: TagsInputInterface) => {
  const {
    tagsInputRef,
    onTagAssignAndClearInput,
    onTagAttachAndClearInput,
    onGetSuggestedTags,
    onTagDetach,
    onTagsDetach,
    myTagsIds,
  } = useComponent(props);

  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const suggestions = onGetSuggestedTags('');

  const inputRef = useRef<HTMLInputElement>();

  const selectedTags = suggestions.filter((suggestion) => myTagsIds.includes(suggestion.id));

  const suggestedTags = suggestions
    .filter(
      (suggestion) =>
        !myTagsIds?.includes(suggestion.id) && fuzzysearch(searchValue.toLowerCase(), suggestion.name.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    inputRef?.current.focus();
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!searchValue) {
          return;
        }
        onTagAssignAndClearInput(searchValue);
        setSearchValue('');
        inputRef.current.value = '';
      }}
    >
      <InputIcon
        innerClassName={styles.inputClassName}
        onSetInnerRef={(ref) => {
          inputRef.current = ref;
        }}
        placeholder={'Search tag'}
        onResetValue={() => {
          setSearchValue('');
        }}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
      />
      <Box
        ref={tagsInputRef}
        className={styles.tagsWrapperClassName}
        onKeyDownCapture={(event: React.KeyboardEvent<HTMLDivElement>) => {
          if (event.key === 'Escape') {
            event.stopPropagation();
          }
        }}
      >
        <div className={styles.clearAll}>
          <span onClick={onTagsDetach}>{t('clear all')}</span>
        </div>

        <TagsList style={{ maxHeight: '17rem' }} tags={selectedTags} onTagDetach={onTagDetach} placeholder={false} />

        <Divider variant="middle" sx={dividerStyles} />

        <TagsList
          style={{ minHeight: '15rem', maxHeight: '25rem' }}
          tags={suggestedTags}
          onTagAttach={onTagAttachAndClearInput}
        />

        <div className={styles.createTagButtonWrapper}>
          <Button
            variant="outlined"
            disabled={!searchValue.length}
            className={styles.createTagButton}
            onClick={() => {
              if (!searchValue) {
                return;
              }
              onTagAssignAndClearInput(searchValue);
              setSearchValue('');
              inputRef.current.value = '';
            }}
          >
            <Add className={styles.createTabButtonIcon} size="sm" />
            <span className={styles.createTabButtonLabel}>{t('Create a tag')}</span>
          </Button>
        </div>
      </Box>
    </form>
  );
};

TagsInputList.defaultProps = {
  shouldFocusOnMount: true,
  isFocused: false,
  objectId: '',
  onSetIsFocused: doNothing,
};

export default TagsInputList;
