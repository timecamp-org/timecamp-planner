import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import BaseComponent from 'commonEnhancers/BaseComponent';

import { selectCustomFieldValue } from '../../../../../../../common/models/domain/ExtensionsModel/selectors/domain';
import {
  ExtensionNamespace,
  FieldType,
  TargetType,
} from '../../../../../../../common/models/domain/ExtensionsModel/types';
import {
  selectCurrentUserInOrganizationIdByUserId,
  selectIsUserActiveInCurrentOrganization,
  selectIsUserOrganizationGuest,
} from '../../../../../../../common/models/domain/OrganizationsModel/selectors/domain';
import { selectIsUserRegistered } from '../../../../../../../common/models/domain/UsersModel/selectors/domain';
import { selectUserStatusTitle } from '../../../../../../../common/models/domain/UserStatusModel/selectors/domain';

function enhance(ComposedComponent) {
  class EnhanceDirectChatNavLinkBottomLabel extends BaseComponent {
    static propTypes = {
      conversationUserId: PropTypes.string.isRequired,
      className: PropTypes.string,
    };

    render() {
      return (
        <ComposedComponent
          isConversationUserInvitationPending={this.props.isConversationUserInvitationPending}
          isUserActive={this.props.isUserActive}
          isUserGuest={this.props.isUserGuest}
          isInvitedByLink={this.props.isInvitedByLink}
          userStatusTitle={this.props.userStatusTitle}
          conversationUserId={this.props.conversationUserId}
          className={this.props.className}
          statusMaxLength={this.props.statusMaxLength}
        />
      );
    }
  }

  const mapStateToProps = (state, props) => {
    const userInOrganizationId = selectCurrentUserInOrganizationIdByUserId(state, { userId: props.conversationUserId });

    return {
      isConversationUserInvitationPending: !selectIsUserRegistered(state, {
        userId: props.conversationUserId,
      }),
      isUserActive: selectIsUserActiveInCurrentOrganization(state, {
        userId: props.conversationUserId,
      }),
      isUserGuest: selectIsUserOrganizationGuest(state, {
        userId: props.conversationUserId,
      }),
      userStatusTitle: selectUserStatusTitle(state, {
        userId: props.conversationUserId,
      }),
      isInvitedByLink: !!selectCustomFieldValue(state, {
        extensionNamespace: ExtensionNamespace.CHAT_WITH_ME,
        targetType: TargetType.USER_IN_ORGANIZATION,
        targetId: userInOrganizationId,
        fieldType: FieldType.INVITER_ID,
      }),
    };
  };

  return connect(mapStateToProps)(EnhanceDirectChatNavLinkBottomLabel);
}

export default enhance;
