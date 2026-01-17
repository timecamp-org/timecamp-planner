import { List } from 'immutable';
import PropTypes from 'prop-types';

import { useTranslation } from 'common/i18n';
import { doNothing } from 'common/utils';
import { ArrowRight } from 'commonComponents/Icons/fontawesome/ArrowRight';
import { BoxArchive } from 'commonComponents/Icons/fontawesome/BoxArchive';
import { Clone } from 'commonComponents/Icons/fontawesome/Clone';
import { RoadBarrier } from 'commonComponents/Icons/fontawesome/RoadBarrier';
import InfoTooltip from 'commonComponents/InfoTooltip';
import SecondaryButton from 'components/buttons/SecondaryButton';
import CardLimit from 'components/taskList/CardLimit';
import CopySection from 'components/taskList/CopySection';
import MoveAllCards from 'components/taskList/MoveAllCards';
import MoveSection from 'components/taskList/MoveSection';
import commonStyles from 'styles/common.css';

import { Divider, Switch } from '@mui/material';
import styles from './styles.css';

SectionOptionsDropdown.propTypes = {
  sectionId: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  isSectionFollowed: PropTypes.bool,
  isSectionFollowingSwitcherDisabled: PropTypes.bool,
  isArchived: PropTypes.bool,
  shouldRenderFollowingSwitcherInfoTooltip: PropTypes.bool,
  onSetIsDropdownVisible: PropTypes.func,
  onSectionMove: PropTypes.func,
  onMouseEnterFollowingController: PropTypes.func,
  onMouseLeaveFollowingController: PropTypes.func,
  onToggleSectionFollowing: PropTypes.func,
  onClickArchiveList: PropTypes.func,
  onClickUnarchiveList: PropTypes.func,
};

SectionOptionsDropdown.defaultProps = {
  isSectionFollowed: false,
  isSectionFollowingSwitcherDisabled: false,
  shouldRenderFollowingSwitcherInfoTooltip: false,
  isArchived: false,
  sectionOptions: new List(),
  onSetIsDropdownVisible: doNothing,
  onSectionMove: doNothing,
  onMouseEnterFollowingController: doNothing,
  onMouseLeaveFollowingController: doNothing,
  onToggleSectionFollowing: doNothing,
  onClickArchiveList: doNothing,
  onClickUnarchiveList: doNothing,
};

function SectionOptionsDropdown(props) {
  const { t } = useTranslation();

  return (
    <div>
      {props.contentType && (
        <div className={styles.header}>
          <SecondaryButton className={styles.arrowLeftButton} onClick={props.onGoBack} color={props.color}>
            <ArrowRight className={styles.arrowLeft} />
          </SecondaryButton>
        </div>
      )}
      <div className={styles.options}>{renderContent(props.contentType)}</div>
    </div>
  );

  function renderContent(contentType) {
    switch (contentType) {
      case 'copyList':
        return renderCopyListContent();
      case 'moveList':
        return renderMoveListContent();
      case 'cardLimit':
        return renderCardLimitContent();
      case 'moveAllCards':
        return renderMoveAllCards();
      default:
        return renderDefaultContent();
    }
  }

  function renderDefaultContent() {
    const canMoveList = props.sectionOptions.indexOf('MoveList') !== -1;
    const canCardLimit = props.sectionOptions.indexOf('CardLimit') !== -1;
    const canMoveAllCards = props.sectionOptions.indexOf('MoveAllCards') !== -1;
    const canCopyList = props.sectionOptions.indexOf('CopyList') !== -1;
    const canArchiveList = props.sectionOptions.indexOf('ArchiveList') !== -1;
    const canFollowList = props.sectionOptions.includes('FollowList');

    return (
      <>
        {canCopyList && (
          <SecondaryButton
            className={styles.optionButton}
            onClick={() => props.onChangeContentType('copyList')}
            color={props.color}
          >
            <div className={styles.option}>
              <Clone className={styles.optionIcon} />
              {t('Copy list')}
            </div>
          </SecondaryButton>
        )}

        {canMoveList && (
          <SecondaryButton
            className={styles.optionButton}
            onClick={() => props.onChangeContentType('moveList')}
            color={props.color}
          >
            <div className={styles.option}>
              <ArrowRight className={styles.optionIcon} />
              {t('Move list')}
            </div>
          </SecondaryButton>
        )}

        {canMoveAllCards && (
          <SecondaryButton
            className={styles.optionButton}
            onClick={() => props.onChangeContentType('moveAllCards')}
            color={props.color}
          >
            <div className={styles.option}>
              <ArrowRight className={styles.optionIcon} />
              {t('Move all tasks in this list...')}
            </div>
          </SecondaryButton>
        )}

        {canCardLimit && (
          <SecondaryButton
            className={styles.optionButton}
            onClick={() => props.onChangeContentType('cardLimit')}
            color={props.color}
          >
            <div className={styles.option}>
              <RoadBarrier className={styles.optionIcon} />
              {t('Task Limit')}
            </div>
          </SecondaryButton>
        )}

        {canArchiveList && (
          <SecondaryButton
            className={styles.optionButton}
            onClick={props.isArchived ? props.onClickUnarchiveList : props.onClickArchiveList}
            color={props.color}
          >
            <div className={styles.option}>
              <BoxArchive className={styles.optionIcon} />
              {props.isArchived ? t('Unarchive list') : t('Archive list')}
            </div>
          </SecondaryButton>
        )}

        {canFollowList && (
          <>
            <Divider />
            <InfoTooltip
              infoTooltipWrapperClassName={styles.followingControllerInfoTooltipWrapperClassName}
              shouldRenderInfoTooltip={props.shouldRenderFollowingSwitcherInfoTooltip}
              targetComponent={
                <div
                  className={styles.taskFollowingOption}
                  onMouseEnter={props.onMouseEnterFollowingController}
                  onMouseLeave={props.onMouseLeaveFollowingController}
                >
                  <Switch
                    checked={props.isSectionFollowed}
                    disabled={props.isSectionFollowingSwitcherDisabled}
                    onClick={props.onToggleSectionFollowing}
                  />
                  <span>{t('Follow')}</span>
                </div>
              }
              popperPlacement={'bottom'}
              popperModifiers={{
                offset: {
                  offset: `0, ${commonStyles.gridCellSize}`,
                },
              }}
              title={t(`You can't unfollow this section because you're following its parent project`)}
            />
          </>
        )}
      </>
    );
  }

  function renderCopyListContent() {
    return (
      <>
        <CopySection
          objectId={props.projectId}
          sectionId={props.sectionId}
          onCopySectionDispatched={props.onCopySectionDispatched}
          onCopySectionCancelled={props.onCopySectionCancelled}
        />
      </>
    );
  }

  function renderMoveListContent() {
    return (
      <>
        <MoveSection
          objectId={props.projectId}
          sectionId={props.sectionId}
          onMoveSectionDispatched={props.onMoveSectionDispatched}
          onMoveSectionCancelled={props.onMoveSectionCancelled}
        />
      </>
    );
  }

  function renderCardLimitContent() {
    return (
      <>
        <CardLimit
          objectId={props.projectId}
          sectionId={props.sectionId}
          onCardLimitSaved={() => props.onSetIsDropdownVisible(false)}
          onCardLimitCancelled={props.onCardLimitCancelled}
        />
      </>
    );
  }

  function renderMoveAllCards() {
    return (
      <>
        <MoveAllCards
          objectId={props.projectId}
          listId={props.sectionId}
          onMoveAllCardsDispatched={props.onMoveAllCardsDispatched}
          onMoveAllCardsCancelled={props.onMoveAllCardsCancelled}
        />
      </>
    );
  }
}

export default SectionOptionsDropdown;
