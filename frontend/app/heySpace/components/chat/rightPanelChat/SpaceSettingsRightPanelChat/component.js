import { ButtonBase } from '@mui/material';
import PropTypes from 'prop-types';

import useElementOpen from 'common/hooks/useElementOpen';
import { doNothing } from 'common/utils';
import { Bell, Copy, Info, Shield, TrashCan } from 'commonComponents/Icons';
import { ChevronDown } from 'commonComponents/Icons/fontawesome/ChevronDown';
import { ChevronUp } from 'commonComponents/Icons/fontawesome/ChevronUp';
import { FloppyDisk } from 'commonComponents/Icons/fontawesome/FloppyDisk';
import MaterialSwitch from 'commonComponents/MaterialSwitch';
import RadioButton from 'commonComponents/RadioButton';
import TooltipedGuestDisabledElement from 'commonComponents/TooltipedGuestDisabledElement';
import SecondaryButton from 'components/buttons/SecondaryButton';
import RightPanelLabel from 'components/chat/rightPanelChat/RightPanelLabel';
import ABTestVisibilityWrapper from 'components/extensions/ABTestVisibilityWrapper';
import { AddProjectTemplateModal } from 'components/projects/AddProjectTemplateModal';
import ArchiveProjectController from 'components/projects/ArchiveProjectController';
import CopySpaceController from 'components/projects/CopySpaceController';
import ProjectBackgroundEditor from 'components/projects/ProjectBackgroundEditor/ProjectBackgroundEditor';
import ProjectColorEditor from 'components/projects/ProjectColorEditor';
import ProjectDescriptionTextArea from 'components/projects/ProjectDescriptionTextArea';
import { ProjectIconController } from 'components/projects/ProjectIconSettings';
import ProjectNameInput from 'components/projects/projectName/ProjectNameInput';
import { useTranslation } from 'i18n';
import { TestGranulation, TestType } from 'models/component/ABTestsModel/types';
import { ChatNotificationSettingsType } from 'models/domain/NotificationsModel/types';
import colorStyles from 'styles/colors.css';

import { SETTINGS } from '../utils/panelNames';

import styles from './styles.css';

const iconSize = 14;

SpaceSettingsRightPanelChat.propTypes = {
  projectId: PropTypes.string.isRequired,
  isConversation: PropTypes.bool,
  color: PropTypes.string.isRequired,
  isCurrentUserFollowingSpace: PropTypes.bool,
  isProjectEditable: PropTypes.bool,

  isDetailsSectionExpanded: PropTypes.bool.isRequired,
  isPrivacySectionExpanded: PropTypes.bool.isRequired,
  isFollowSectionExpanded: PropTypes.bool.isRequired,
  isChatNotificationSettingsSectionExpanded: PropTypes.bool.isRequired,

  chatNotificationSettingsType: PropTypes.string.isRequired,

  onSetIsDetailsSectionExpanded: PropTypes.func.isRequired,
  onSetIsPrivacySectionExpanded: PropTypes.func.isRequired,
  onSetIsFollowSectionExpanded: PropTypes.func.isRequired,
  onSetIsChatNotificationSettingsSectionExpanded: PropTypes.func.isRequired,

  onToggleSpaceFollowing: PropTypes.func,
  onSetChatNotificationSettingsType: PropTypes.func.isRequired,
  onSetIsPrivate: PropTypes.func.isRequired,
  onSetIsPublic: PropTypes.func.isRequired,
};

SpaceSettingsRightPanelChat.defaultProps = {
  isConversation: false,
  color: colorStyles.wisteriaColor,
  isCurrentUserFollowingSpace: false,

  isDetailsSectionExpanded: true,
  isPrivacySectionExpanded: true,
  isFollowSectionExpanded: true,
  isChatNotificationSettingsSectionExpanded: true,
  isProjectEditable: true,

  chatNotificationSettingsType: ChatNotificationSettingsType.ONLY_MENTIONS,

  onSetIsDetailsSectionExpanded: doNothing,
  onSetIsPrivacySectionExpanded: doNothing,
  onSetIsFollowSectionExpanded: doNothing,
  onSetIsChatNotificationSettingsSectionExpanded: doNothing,

  onToggleSpaceFollowing: doNothing,
  onSetChatNotificationSettingsType: doNothing,
  onSetIsPrivate: doNothing,
  onSetIsPublic: doNothing,
};

function SpaceSettingsRightPanelChat(props) {
  const { t } = useTranslation();

  return (
    <div className={styles.Component}>
      {renderHeader(props)}
      <div className={styles.settings}>
        <div className={styles.permissionNote}>
          {t('Note that only Project manager can fully modify projecct settings.')}
        </div>
        <ABTestVisibilityWrapper
          testType={TestType.TIMECAMP_ORGANIZATION}
          granulation={TestGranulation.ORGANIZATION}
          baseComponent={<></>}
        >
          <>{renderCustomTemplateSection(props, t)}</>
        </ABTestVisibilityWrapper>
        {renderDetailsSection(props, t)}
        <ABTestVisibilityWrapper
          testType={TestType.TIMECAMP_ORGANIZATION}
          granulation={TestGranulation.ORGANIZATION}
          baseComponent={<></>}
        >
          {renderBackgroundSection(props, t)}
        </ABTestVisibilityWrapper>
        {renderFollowSection(props, t)}
        {renderPrivacySection(props, t)}
        {renderChatNotificationSettingsSection(props, t)}
        {renderCopySpaceSection(props, t)}
        {renderArchiveSection(props, t)}
      </div>
    </div>
  );
}

function renderHeader(props) {
  return (
    <div className={styles.header}>
      <RightPanelLabel objectId={props.projectId} currentPanelName={SETTINGS} />
    </div>
  );
}

function renderDetailsSection(props, t) {
  return (
    <div
      className={`
      ${styles.sectionNoTopMargin} 
      ${props.isDetailsSectionExpanded || styles.sectionClosed}
    `}
    >
      <div className={styles.sectionHeader}>
        <Info size={iconSize} />
        <div className={styles.sectionHeaderText}>{t('Details')}</div>
        <SecondaryButton
          onClick={() => props.onSetIsDetailsSectionExpanded(!props.isDetailsSectionExpanded)}
          color={props.color}
          className={styles.chevron}
        >
          {props.isDetailsSectionExpanded ? <ChevronUp /> : <ChevronDown />}
        </SecondaryButton>
      </div>
      <ProjectNameInput
        className={styles.input}
        projectId={props.projectId}
        label={t('Project name')}
        isDisabled={!props.isProjectEditable}
      />
      <ProjectDescriptionTextArea
        projectId={props.projectId}
        label={t('Purpose')}
        innerClassName={styles.textarea}
        isDisabled={!props.isProjectEditable}
      />
      <div className={styles.label}>{t('Icon')}</div>
      <ProjectIconController
        projectId={props.projectId}
        className={styles.projectIconEditor}
        isDisabled={!props.isProjectEditable}
      />
      <div className={styles.label}>{t('Colour')}</div>
      <ProjectColorEditor
        projectId={props.projectId}
        className={styles.projectColorEditor}
        isDisabled={!props.isProjectEditable}
      />
    </div>
  );
}
function renderBackgroundSection(props, t) {
  return (
    <div
      className={`
      ${styles.sectionNoTopMargin} 
      ${props.isBackgroundSectionExpanded || styles.sectionClosed}
    `}
    >
      <div className={styles.sectionHeader}>
        <Info size={iconSize} />
        <div className={styles.sectionHeaderText}>{t('Background')}</div>
        <SecondaryButton
          onClick={() => props.onSetIsBackgroundSectionExpanded(!props.isBackgroundSectionExpanded)}
          color={props.color}
          className={styles.chevron}
        >
          {props.isBackgroundSectionExpanded ? <ChevronUp /> : <ChevronDown />}
        </SecondaryButton>
      </div>
      <div className={styles.label}>
        {props.isEditable
          ? t('Choose a background color or upload your own image')
          : t("You don't have permission to set the background")}
      </div>

      {props.isEditable && (
        <ProjectBackgroundEditor
          projectId={props.projectId}
          className={styles.projectColorEditor}
          isDisabled={!props.isProjectEditable}
        />
      )}
    </div>
  );
}

function renderPrivacySection(props, t) {
  return (
    <div className={`${styles.section} ${props.isPrivacySectionExpanded || styles.sectionClosed}`}>
      <div className={styles.sectionHeader}>
        <Shield size={iconSize} />
        <div className={styles.sectionHeaderText}>{t('Privacy')}</div>
        <SecondaryButton
          onClick={() => props.onSetIsPrivacySectionExpanded(!props.isPrivacySectionExpanded)}
          color={props.color}
          className={styles.chevron}
        >
          {props.isPrivacySectionExpanded ? <ChevronUp /> : <ChevronDown />}
        </SecondaryButton>
      </div>
      <div className={styles.radioButton}>
        <RadioButton
          label={t('Public to team')}
          isChecked={!props.isPrivate}
          isDisabled={!props.isProjectEditable}
          onClick={props.onSetIsPublic}
          color={props.color}
        />
      </div>
      <div className={`${styles.description} ${styles.marginBottom}`}>
        {t('Project is visible to members of your team. Only people added to the project can edit it.')}
      </div>
      <div className={styles.radioButton}>
        <RadioButton
          label={t('Private')}
          isChecked={props.isPrivate}
          isDisabled={!props.isProjectEditable}
          onClick={props.onSetIsPrivate}
          color={props.color}
        />
      </div>
      <div className={styles.description}>
        {t('Project is private. Only people added to the project can view it and edit.')}
      </div>
    </div>
  );
}

function renderArchiveSection(props, t) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <TrashCan size={iconSize} />
        <div className={styles.sectionHeaderText}>{t('Archive')}</div>
      </div>
      <div className={styles.description}>
        {t(
          `You might want to archive this project if it's not used anymore. Once it's archived, it won't show up on project list.`,
        )}
      </div>
      <ArchiveProjectController
        isDisabled={!props.isProjectEditable}
        projectId={props.projectId}
        color={props.color}
        className={styles.archive}
      />
    </div>
  );
}

function renderCopySpaceSection(props, t) {
  const { isOpen: isCopySpaceSectionExpanded, onToggleOpen: onToggleCopySpaceSection } = useElementOpen(true);

  return (
    <div className={`${styles.section} ${isCopySpaceSectionExpanded || styles.sectionClosed}`}>
      <div className={styles.sectionHeader}>
        <Copy size={iconSize} />
        <div className={styles.sectionHeaderText}>{t('Copy project')}</div>
        <SecondaryButton className={styles.chevron} color={props.color} onClick={onToggleCopySpaceSection}>
          {props.isCopySpaceSectionExpanded ? <ChevronUp /> : <ChevronDown />}
        </SecondaryButton>
      </div>
      <TooltipedGuestDisabledElement>
        {(parentProps) => (
          <CopySpaceController projectId={props.projectId} color={props.color} isDisabled={parentProps.isDisabled} />
        )}
      </TooltipedGuestDisabledElement>
    </div>
  );
}

function renderFollowSection(props, t) {
  return (
    <div className={`${styles.section} ${props.isFollowSectionExpanded || styles.sectionClosed}`}>
      <div className={styles.sectionHeader}>
        <Info size={iconSize} />
        <div className={styles.sectionHeaderText}>{t('Follow board')}</div>
        <SecondaryButton
          onClick={() => props.onSetIsFollowSectionExpanded(!props.isFollowSectionExpanded)}
          className={styles.chevron}
        >
          {props.isFollowSectionExpanded ? <ChevronUp /> : <ChevronDown />}
        </SecondaryButton>
      </div>
      <div className={styles.inline}>
        <MaterialSwitch
          isChecked={props.isCurrentUserFollowingSpace}
          color={props.color}
          onClick={props.onToggleSpaceFollowing}
        />
        <div className={styles.switchTitle}>{t('Follow project')}</div>
      </div>
      <div className={styles.description}>
        {t('Receive notifications when people make important changes to any task in this project')}
      </div>
    </div>
  );
}

function renderChatNotificationSettingsSection(props, t) {
  return (
    <div className={`${styles.section} ${props.isChatNotificationSettingsSectionExpanded || styles.sectionClosed}`}>
      <div className={styles.sectionHeader}>
        <Bell size={iconSize} />
        <div className={styles.sectionHeaderText}>{t('Chat notification preferences')}</div>
        <SecondaryButton
          onClick={() =>
            props.onSetIsChatNotificationSettingsSectionExpanded(!props.isChatNotificationSettingsSectionExpanded)
          }
          className={styles.chevron}
          color={props.color}
        >
          {props.isChatNotificationSettingsSectionExpanded ? <ChevronUp /> : <ChevronDown />}
        </SecondaryButton>
      </div>

      <div className={styles.radioButton}>
        <RadioButton
          label={t('All new messages')}
          isChecked={props.chatNotificationSettingsType === ChatNotificationSettingsType.ALL}
          onClick={() => props.onSetChatNotificationSettingsType(ChatNotificationSettingsType.ALL)}
          color={props.color}
        />
      </div>
      <div className={`${styles.description} ${styles.marginBottom}`}>
        {t('Notify me about all new messages in this project.')}
      </div>

      <div className={styles.radioButton}>
        <RadioButton
          label={t('Just mentions')}
          isChecked={props.chatNotificationSettingsType === ChatNotificationSettingsType.ONLY_MENTIONS}
          onClick={() => props.onSetChatNotificationSettingsType(ChatNotificationSettingsType.ONLY_MENTIONS)}
          color={props.color}
        />
      </div>
      <div className={`${styles.description} ${styles.marginBottom}`}>
        {t('Notify me about any mention used in project e.g. @yourname, @here')}
      </div>

      <div className={styles.radioButton}>
        <RadioButton
          label={t('Nothing')}
          isChecked={props.chatNotificationSettingsType === ChatNotificationSettingsType.NOTHING}
          onClick={() => props.onSetChatNotificationSettingsType(ChatNotificationSettingsType.NOTHING)}
          color={props.color}
        />
      </div>
      <div className={styles.description}>
        {t('Mute all chat notifications. Muted project will apear grayed out on your menu. ')}
      </div>
    </div>
  );
}

function renderCustomTemplateSection(props, t) {
  return (
    <div className={`${styles.section} ${props.isCustomTemplateSectionExpanded || styles.sectionClosed}`}>
      <div className={styles.sectionHeader}>
        <Info size={iconSize} />
        <div className={styles.sectionHeaderText}>{t('Custom Templates')}</div>
        <SecondaryButton
          onClick={() => props.onSetIsCustomTemplateSectionExpanded(!props.isCustomTemplateSectionExpanded)}
          className={styles.chevron}
        >
          {props.isCustomTemplateSectionExpanded ? <ChevronUp /> : <ChevronDown />}
        </SecondaryButton>
      </div>
      <div className={styles.inline}>
        <ButtonBase onClick={props.onOpenAddProjectTemplateModal} className={styles.buttonFullWidth}>
          <span>{t('Save board as template')}</span>
          <FloppyDisk />
        </ButtonBase>
      </div>
      {props.isAddTemplateModalOpen && (
        <AddProjectTemplateModal
          isOpen={props.isAddTemplateModalOpen}
          onClose={props.onCloseAddProjectTemplateModal}
          projectId={props.projectId}
        />
      )}
    </div>
  );
}

export default SpaceSettingsRightPanelChat;
