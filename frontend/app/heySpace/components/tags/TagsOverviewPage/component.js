import { Fragment } from 'react';

import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { doNothing } from 'common/utils';
import HorizontalDivider from 'commonComponents/HorizontalDivider';
import LoadingDots from 'commonComponents/LoadingDots';
import NoAccessToFeatureModal from 'commonComponents/NoAccessToFeatureModal';
import PopoverContent from 'commonComponents/PopoverContent';
import UniversalPopover from 'commonComponents/UniversalPopover';
import UserInput from 'commonComponents/UserInput';
import { tagsColors } from 'commonStyles/colors';
import ProjectColorDot from 'components/projects/ProjectColorDot/component';
import DeleteTag from 'components/tags/DeleteTag';
import EditTagColor from 'components/tags/EditTagColor';
import EditTagName from 'components/tags/EditTagName';
import Tag from 'components/tags/Tag';
import { useTranslation } from 'i18n';
import colorStyles from 'styles/colors.css';

import styles from './styles.css';

TagsOverviewPage.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  hasAccessToTags: PropTypes.bool.isRequired,
  groupedAndOrderedTags: ImmutablePropTypes.listOf(
    ImmutablePropTypes.contains({
      firstLetter: PropTypes.string.isRequired,
      tagsTaskIds: ImmutablePropTypes.listOf(
        ImmutablePropTypes.contains({
          tagId: PropTypes.string.isRequired,
          taskIds: ImmutablePropTypes.listOf(PropTypes.string.isRequired),
        }),
      ).isRequired,
    }),
  ).isRequired,
  isEditTagNamePopoverOpen: PropTypes.bool,
  isCreateTagPopoverOpen: PropTypes.bool,
  isEditTagColorPopoverOpen: PropTypes.bool,
  isDeleteTagConfirmationPopoverOpen: PropTypes.bool,
  isCreateTagDisabled: PropTypes.bool,
  tagName: PropTypes.string,
  tagColor: PropTypes.string,

  onClickEditTagNameIcon: PropTypes.func,
  onClickEditTagColorIcon: PropTypes.func,
  onClickDeleteTagIcon: PropTypes.func,
  onSetIsCreateTagPopoverOpen: PropTypes.func,
  onCreateTag: PropTypes.func,
  onChangeTagName: PropTypes.func,
  onChangeTagColor: PropTypes.func,
};

TagsOverviewPage.defaultProps = {
  isEditTagNamePopoverOpen: false,
  isEditTagColorPopoverOpen: false,
  isDeleteTagConfirmationPopoverOpen: false,
  isCreateTagPopoverOpen: false,
  isCreateTagDisabled: false,
  tagName: '',
  tagColor: '',

  onClickEditTagNameIcon: doNothing,
  onClickEditTagColorIcon: doNothing,
  onClickDeleteTagIcon: doNothing,
  onSetIsCreateTagPopoverOpen: doNothing,
  onCreateTag: doNothing,
  onChangeTagName: doNothing,
  onChangeTagColor: doNothing,
};

function TagsOverviewPage(props) {
  const { t } = useTranslation();

  return (
    <div className={styles.settingsRow}>
      <div className={styles.settingsSection}>
        {renderHeader(props)}
        {props.isLoading ? renderLoadingDots() : renderTagsOverview(props)}
      </div>
    </div>
  );

  function renderHeader() {
    return (
      <div className={styles.header}>
        <span className={styles.column}>{t('Name')}</span>
        <span className={styles.column}>{t('Tasks')}</span>
        {renderAddTagPopover(props)}
      </div>
    );
  }

  function renderAddTagPopover() {
    return (
      <UniversalPopover
        isPopoverOpened={props.isCreateTagPopoverOpen}
        targetComponent={renderCreateTagButton()}
        popperComponent={renderCreateTagContent()}
        popperPlacement={'top'}
        popperContentWrapperClassName={styles.popperContentWrapperClassName}
        popperModifiers={{
          offset: {
            offset: `0, 20`,
          },
        }}
      ></UniversalPopover>
    );
  }

  function renderCreateTagButton() {
    return (
      <Button variant="text" onClick={() => props.onSetIsCreateTagPopoverOpen(true)}>
        {t('Add new tag')}
      </Button>
    );
  }

  function renderCreateTagContent() {
    return (
      <PopoverContent
        isVisible={props.isCreateTagPopoverOpen}
        onClickOutside={() => props.onSetIsCreateTagPopoverOpen(false)}
      >
        <div className={styles.popoverHeader}>
          <span className={styles.title}>{t('Create new tag')}</span>
          <div className={styles.separator} />
        </div>
        <div className={styles.label}>{t('Tag name:')}</div>
        <UserInput value={props.tagName} placeholder={t('Type tag name')} onChange={props.onChangeTagName} />
        <div className={styles.label}>{t('Tag color:')}</div>
        {renderTagColorSwitcher()}
        <div className={styles.buttons}>
          <Button variant="text" onClick={() => props.onSetIsCreateTagPopoverOpen(false)}>
            {t('Cancel')}
          </Button>
          <Button onClick={props.onCreateTag} disabled={props.isCreateTagDisabled}>
            {t('Create tag')}
          </Button>
        </div>
      </PopoverContent>
    );
  }

  function renderTagColorSwitcher() {
    return <div className={styles.colorPicker}>{tagsColors.map(renderTagColor)}</div>;
  }

  function renderTagColor(colorHex) {
    return (
      <div key={colorHex} onClick={() => props.onChangeTagColor(colorHex)}>
        <ProjectColorDot
          className={`${styles.colorDot}${colorHex === props.tagColor ? ` ${styles.selectedColorDot}` : ''}`}
          innerClassName={styles.innerDot}
          projectColor={colorHex}
          projectId={''}
          disabled={false}
          shouldRenderTick={colorHex === props.tagColor}
          shouldRenderInnerRing={false}
        />
      </div>
    );
  }

  function renderLoadingDots() {
    return (
      <div className={styles.loaderWrapper}>
        <LoadingDots className={styles.loadingDots} style={{ color: colorStyles.wisteriaColor }} />
      </div>
    );
  }

  function renderTagsOverview() {
    return (
      <Fragment>
        {props.groupedAndOrderedTags.map(renderGroupedTags)}
        {!props.hasAccessToTags && (
          <NoAccessToFeatureModal
            title={t('Tags are not available in your current plan.')}
            featureName={t('Tags')}
            fallbackUrl={'/settings/profile'}
          />
        )}
      </Fragment>
    );
  }

  function renderGroupedTags(groupedTags) {
    const firstLetter = groupedTags.get('firstLetter');
    const tagsTaskIds = groupedTags.get('tagsTaskIds');

    return (
      <div className={styles.tagsGroup} key={`tag-group-letter-${firstLetter}`}>
        <HorizontalDivider className={styles.horizontalDivider} />
        <span className={styles.tagFirstLetter}>{firstLetter}</span>
        {tagsTaskIds.map(renderTagGroup)}
      </div>
    );
  }

  function renderTagGroup(tagTaskIds) {
    const tagId = tagTaskIds.get('tagId');
    const taskIds = tagTaskIds.get('taskIds');
    const tagTasksCount = taskIds.size;

    return (
      <div key={tagId} className={styles.tagOverview}>
        <span className={styles.column}>
          <Tag tagId={tagId} isDeletable={false} className={styles.tag} />
          <div className={styles.actionIcons}>
            <EditTagName tagId={tagId} />
            <EditTagColor tagId={tagId} />
            <DeleteTag tagId={tagId} />
          </div>
        </span>
        <span className={styles.tasksCount}>
          <b>{tagTasksCount}</b>
          {t(` card_count`, { count: tagTasksCount })}
        </span>
      </div>
    );
  }
}

export default TagsOverviewPage;
