import React from 'react';
import { connect } from 'react-redux';
import BaseComponent from 'commonEnhancers/BaseComponent';
import { selectCurrentUserInOrganizationId } from 'models/domain/OrganizationsModel/selectors';

import {
  ExtensionNamespace,
  TargetType,
} from 'models/domain/ExtensionsModel/types';
import { selectExtensionIdByNamespace } from 'models/domain/ExtensionsModel/selectors/domain';
import { fetchCustomRelation } from 'models/domain/RequestModel/constants/requestTypes';
import { selectRequestIsSuccess } from 'models/domain/RequestModel/selectors';
import { selectIsCurrentUserOrganizationGuest } from 'models/domain/OrganizationsModel/selectors';
import { onGenerateInvitationToken } from 'models/domain/ChatWithMeModel/actions';
import { selectInvitationToken } from 'models/domain/ChatWithMeModel/selectors';
import { FIRST_PROJECT_NAME } from 'models/domain/ProjectsModel/constants';

import EnhanceWithRouter from 'enhancers/EnhanceWithRouter';

function Enhance(ComposedComponent) {
  @EnhanceWithRouter()
  class EnhanceChatWithMeForm extends BaseComponent {
    static propTypes = {};

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          invitationLink={this.getInvitationLink()}
          onGenerateLink={this.props.onGenerateLink}
          onCopyLink={this.onCopyLink}
          onSetInputRef={this.onSetInputRef}
        />
      );
    }

    getInvitationLink() {
      const { invitationToken } = this.props;
      if (invitationToken) {
        return `${window.location.origin}/chatWithMe/join/${invitationToken}`;
      } else {
        return '';
      }
    }

    onSetInputRef(ref) {
      this.inputRef = ref;
    }

    onCopyLink() {
      if (this.inputRef) {
        this.onCopyToClipboard();
      }
    }

    onCopyToClipboard() {
      if (this.inputRef) {
        this.inputRef.select();
        document.execCommand('copy');
      }
    }

    componentDidUpdate(prevProps) {
      if (this.props.isCurrentUserOrganizationGuest) {
        return this.props.history.push(`/projects/${FIRST_PROJECT_NAME}`);
      }

      if (
        !prevProps.isInvitationTokenRequestSuccess &&
        this.props.isInvitationTokenRequestSuccess &&
        !this.props.invitationToken
      ) {
        this.props.onGenerateLink(false);
      }
      if (
        !prevProps.invitationToken &&
        this.props.invitationToken &&
        this.inputRef
      ) {
        this.inputRef.select();
      }
    }

    componentDidMount() {
      if (
        !this.props.invitationToken &&
        this.props.isInvitationTokenRequestSuccess &&
        !this.props.isCurrentUserOrganizationGuest
      ) {
        this.props.onGenerateLink(false);
      }
    }
  }

  function mapStateToProps(state) {
    const userInOrganizationId = selectCurrentUserInOrganizationId(state);
    return {
      userInOrganizationId,
      isInvitationTokenRequestSuccess: selectRequestIsSuccess(state, {
        requestType: fetchCustomRelation,
        objectId: [
          ExtensionNamespace.CHAT_WITH_ME,
          TargetType.USER_IN_ORGANIZATION,
          userInOrganizationId,
        ],
      }),
      isCurrentUserOrganizationGuest:
        selectIsCurrentUserOrganizationGuest(state),
      extensionId: selectExtensionIdByNamespace(state, {
        extensionNamespace: ExtensionNamespace.CHAT_WITH_ME,
      }),
      invitationToken: selectInvitationToken(state),
    };
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onGenerateLink: (showAlert) =>
        dispatch(onGenerateInvitationToken(showAlert)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceChatWithMeForm);
}

export default Enhance;
