import React from 'react';

import { Id } from 'common/utils/identifier';
import { Xmark } from 'commonComponents/Icons/fontawesome/Xmark';
import PopoverContent from 'commonComponents/PopoverContent';
import UniversalPopover from 'commonComponents/UniversalPopover';
import Button from 'components/buttons/Button';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { useTranslation } from 'i18n';
import { TranslateFunction } from 'i18n/types';

import { getConditionalClass } from '../../../utils/getConditionalClass';
import Tag from '../Tag';
import TagsInputList from '../TagsInputList';

import { TagListHookInterface, useComponent } from './hook';
import styles from './styles.css';

export type TagListInterface = {
  objectId: Id;
  className?: string;
  tagClassName?: string;
  customButtonClassName?: string;
  maxTagsToShow?: number;
  tagMaxLength?: number;

  isDeletable?: boolean;
  showAddTagOnEmpty?: boolean;
  hideTagsPopover?: boolean;
  showAddTagOnBelowMaxLimit?: boolean;
  addTagButtonRenderer?: (props: { onOpen: () => void; isOpen: boolean }) => JSX.Element;
};

const defaultProps = {
  isDeletable: false,
  showAddTagOnEmpty: false,
};

const popperModifiers = {
  offset: {
    offset: `-16, 16`,
  },
  preventOverflow: {
    boundariesElement: 'window',
  },
};

const TagList: React.FC<TagListInterface> = (props) => {
  const hook = useComponent(props);
  const { t } = useTranslation();

  return (
    <div className={props.className || styles.component}>
      {hook.tagIds.map((tagId) => (
        <Tag
          key={tagId}
          tagId={tagId}
          onRemoveTag={hook.onRemoveTag}
          isDeletable={props.isDeletable}
          className={props.tagClassName || styles.tag}
          maxTagLength={props.tagMaxLength}
        />
      ))}
      {!props.hideTagsPopover && renderTagsPopover(hook, props, t)}
    </div>
  );
};

function renderTagsPopover(hook: TagListHookInterface, props: TagListInterface, t: TranslateFunction) {
  return (
    <PopoverContent onClickOutside={hook.onCloseTagsPopover} isVisible={hook.isTagsPopoverOpen}>
      <UniversalPopover
        isPopoverOpened={hook.isTagsPopoverOpen}
        targetComponent={renderPopoverTarget(hook, props, t)}
        popperContentWrapperClassName={styles.popoverWrapper}
        popperComponent={renderTagsInput(hook, props, t)}
        popperPlacement={'bottom'}
        popperModifiers={popperModifiers}
      />
    </PopoverContent>
  );
}

function renderPopoverTarget(hook: TagListHookInterface, props: TagListInterface, t: TranslateFunction) {
  if (hook.shouldTruncateTags) {
    return renderShowMoreTag(hook, props);
  }

  if (props.showAddTagOnEmpty && !hook.tagsCount) {
    return renderAddTagsButton(hook, props, t);
  }

  if (hook.tagsCount && props.showAddTagOnBelowMaxLimit) {
    return renderAddTagsButton(hook, props, t);
  }

  return null;
}

function renderShowMoreTag(hook: TagListHookInterface, props: TagListInterface) {
  const tagsOverLimit = hook.tagsCount - props.maxTagsToShow;

  return (
    <div className={`${styles.showMoreTag} ${props.tagClassName || styles.tag}`} onClick={hook.onOpenTagsPopover}>
      {'+'}
      {tagsOverLimit}
    </div>
  );
}

function renderAddTagsButton(hook: TagListHookInterface, props: TagListInterface, t: TranslateFunction) {
  return props.addTagButtonRenderer ? (
    props.addTagButtonRenderer({ onOpen: hook.onOpenTagsPopover, isOpen: hook.isTagsPopoverOpen })
  ) : (
    <Button
      className={`${styles.button} ${getConditionalClass(
        props?.customButtonClassName,
        !!props?.customButtonClassName
      )}`}
      onClick={hook.onToggleTagsPopover}
    >
      {t('Add a tag')}
    </Button>
  );
}

function renderTagsInput(hook: TagListHookInterface, props: TagListInterface, t: TranslateFunction) {
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerTitle}>{t('Select tags')}</div>
        <SecondaryButton onClick={hook.onCloseTagsPopover}>
          <Xmark className={styles.headerXMark} />
        </SecondaryButton>
      </div>

      <TagsInputList
        className={styles.taskTags}
        tagsWrapperClassName={styles.tagsWrapperClassName}
        focusedClassName={styles.taskTagsFocused}
        objectId={props.objectId}
        shouldFocusOnMount={false}
        isFocused={hook.isInputFocused}
        onSetIsFocused={hook.onSetIsInputFocused}
      />
    </div>
  );
}

TagList.defaultProps = defaultProps;

export default TagList;
