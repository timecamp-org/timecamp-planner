import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { UserTracker } from 'common/services';
import BaseComponent from 'commonEnhancers/BaseComponent';
import EnhanceWithRouter from 'enhancers/EnhanceWithRouter';
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants';
import { onSetChatNotificationSettingsType } from 'models/domain/NotificationsModel/actions';
import { selectChatNotificationSettingsType } from 'models/domain/NotificationsModel/selectors';
import {
  onFollowerAdd,
  onFollowerRemove,
  onProjectUpdate,
  onUpdateProjectPrivacy,
} from 'models/domain/ProjectsModel/actions';
import {
  selectIsCurrentUserProjectFollower,
  selectProjectColor,
  selectProjectIsGroupOrDirectChat,
  selectProjectIsPrivate,
} from 'models/domain/ProjectsModel/selectors';
import { selectIsProjectEditable } from 'models/domain/ProjectsModel/selectors/permission';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';

function Enhance(ComposedComponent) {
  @EnhanceWithRouter()
  class EnhanceSpaceSettingsRightPanelChat extends BaseComponent {
    static propTypes = {
      projectId: PropTypes.string.isRequired,
      isConversation: PropTypes.bool,
      color: PropTypes.string.isRequired,
      isCurrentUserFollowingSpace: PropTypes.bool.isRequired,
    };

    static defaultProps = {};

    state = {
      isDetailsSectionExpanded: true,
      isBackgroundSectionExpanded: true,
      isPrivacySectionExpanded: true,
      isFollowSectionExpanded: true,
      isChatNotificationSettingsSectionExpanded: true,
      isCustomTemplateSectionExpanded: true,
    };

    render() {
      return (
        <ComposedComponent
          projectId={this.props.projectId}
          isConversation={this.props.isConversation}
          isPrivate={this.props.isPrivate}
          isProjectEditable={this.props.isProjectEditable}
          color={this.props.color}
          isCurrentUserFollowingSpace={this.props.isCurrentUserFollowingSpace}
          chatNotificationSettingsType={this.props.chatNotificationSettingsType}
          isDetailsSectionExpanded={this.state.isDetailsSectionExpanded}
          isBackgroundSectionExpanded={this.state.isBackgroundSectionExpanded}
          isPrivacySectionExpanded={this.state.isPrivacySectionExpanded}
          isFollowSectionExpanded={this.state.isFollowSectionExpanded}
          isChatNotificationSettingsSectionExpanded={this.state.isChatNotificationSettingsSectionExpanded}
          isCustomTemplateSectionExpanded={this.state.isCustomTemplateSectionExpanded}
          isAddTemplateModalOpen={this.state.isAddTemplateModalOpen}
          onSetIsDetailsSectionExpanded={this.onSetIsDetailsSectionExpanded}
          onSetIsBackgroundSectionExpanded={this.onSetIsBackgroundSectionExpanded}
          onSetIsPrivacySectionExpanded={this.onSetIsPrivacySectionExpanded}
          onSetIsFollowSectionExpanded={this.onSetIsFollowSectionExpanded}
          onSetIsChatNotificationSettingsSectionExpanded={this.onSetIsChatNotificationSettingsSectionExpanded}
          onSetIsPrivate={this.onSetIsPrivate}
          onSetIsPublic={this.onSetIsPublic}
          onToggleSpaceFollowing={this.onToggleSpaceFollowing}
          onSetChatNotificationSettingsType={this.props.onSetChatNotificationSettingsType}
          onOpenAddProjectTemplateModal={this.onOpenAddProjectTemplateModal}
          onCloseAddProjectTemplateModal={this.onCloseAddProjectTemplateModal}
          onSetIsCustomTemplateSectionExpanded={this.onSetIsCustomTemplateSectionExpanded}
        />
      );
    }

    onSetIsFollowingSpace(isFollowing) {
      if (isFollowing) {
        this.props.onMemberAdd();
      } else {
        this.props.onMemberRemove();
      }
    }

    onSetIsDetailsSectionExpanded(isExpanded) {
      this.setState({
        isDetailsSectionExpanded: isExpanded,
      });
    }

    onSetIsBackgroundSectionExpanded(isExpanded) {
      this.setState({
        isBackgroundSectionExpanded: isExpanded,
      });
    }

    onSetIsPrivacySectionExpanded(isExpanded) {
      this.setState({
        isPrivacySectionExpanded: isExpanded,
      });
    }

    onSetIsFollowSectionExpanded(isExpanded) {
      this.setState({
        isFollowSectionExpanded: isExpanded,
      });
    }

    onSetIsChatNotificationSettingsSectionExpanded(isExpanded) {
      this.setState({
        isChatNotificationSettingsSectionExpanded: isExpanded,
      });
    }

    onSetIsCustomTemplateSectionExpanded(isExpanded) {
      this.setState({
        isCustomTemplateSectionExpanded: isExpanded,
      });
    }

    onOpenAddProjectTemplateModal() {
      this.setState({
        isAddTemplateModalOpen: true,
      });
    }

    onCloseAddProjectTemplateModal() {
      this.setState({
        isAddTemplateModalOpen: false,
      });
    }

    onUpdateIsPrivate(isPrivate) {
      if (isPrivate) {
        UserTracker.track(UserTrackerEvent.spaceEdited, {
          what: 'made-private',
        });
      } else {
        UserTracker.track(UserTrackerEvent.spaceEdited, {
          what: 'made-public',
        });
      }
      this.props.onProjectUpdate({ isPrivate });
      this.props.onUpdateProjectPrivacy(isPrivate);
    }

    onSetIsPrivate() {
      this.onUpdateIsPrivate(true);
    }

    onSetIsPublic() {
      this.onUpdateIsPrivate(false);
    }

    onToggleSpaceFollowing() {
      if (this.props.isCurrentUserFollowingSpace) {
        this.props.onUnfollowSpace(this.props.currentUserId);
      } else {
        this.props.onFollowSpace(this.props.currentUserId);
      }
    }
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onProjectUpdate: (projectFields) => dispatch(onProjectUpdate(props.projectId, projectFields)),
      onUpdateProjectPrivacy: (isPrivate) => dispatch(onUpdateProjectPrivacy(props.projectId, isPrivate)),
      onFollowSpace: (userId) => dispatch(onFollowerAdd(props.projectId, userId)),
      onUnfollowSpace: (userId) => dispatch(onFollowerRemove(props.projectId, userId)),
      onSetChatNotificationSettingsType: (type) => dispatch(onSetChatNotificationSettingsType(props.projectId, type)),
    };
  }

  const mapStateToProps = (state, props) => ({
    isConversation: selectProjectIsGroupOrDirectChat(state, {
      projectId: props.projectId,
    }),
    isPrivate: selectProjectIsPrivate(state, { projectId: props.projectId }),
    color: selectProjectColor(state, { projectId: props.projectId }),
    isCurrentUserFollowingSpace: selectIsCurrentUserProjectFollower(state, {
      projectId: props.projectId,
    }),
    currentUserId: selectCurrentUserId(state),
    chatNotificationSettingsType: selectChatNotificationSettingsType(state, {
      objectId: props.projectId,
    }),
    isProjectEditable: selectIsProjectEditable(state, {
      projectId: props.projectId,
    }),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceSpaceSettingsRightPanelChat);
}

export default Enhance;
