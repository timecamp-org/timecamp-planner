import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectRequestIsLoading } from 'models/domain/RequestModel/selectors';
import * as RequestTypes from 'models/domain/RequestModel/constants/requestTypes';
import { HumanMessage } from 'models/domain/HumanMessageModel/models'
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types'
import { isValidEmail } from 'common/utils/validation';
import { doNothing } from 'common/utils';
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants';
import { UserTracker } from 'common/services';
import generatePushId from 'common/utils/generate-pushid';

import EnhanceWithRouter from 'enhancers/EnhanceWithRouter';

import BaseComponent from 'commonEnhancers/BaseComponent';

import * as OrganizationsModelActions from 'models/domain/OrganizationsModel/actions';
import * as OrganizationsModelSelectors from 'models/domain/OrganizationsModel/selectors';
import { List } from 'immutable';

function enhance(Component) {
  @EnhanceWithRouter()
  class EnhanceWorkspaceInvitationsForm extends BaseComponent {
    static propTypes = {
      history: PropTypes.object,
      title: PropTypes.string,
      onSubmit: PropTypes.func,
    };

    static defaultProps = {
      onSubmit: doNothing,
    };

    state = {
      email: '',
      emailHumanMessageModel: null,
      isInviteUserModalOpen: false,
      selectedEmails: new List(),
    };

    render() {
      return (
        <Component
          className={this.props.className}
          submitButtonClassName={this.props.submitButtonClassName}
          submitButtonInnerClassName={this.props.submitButtonInnerClassName}
          isSubmitting={this.props.isSubmitting}
          genericHumanMessageModel={this.props.genericHumanMessageModel}
          organizationUserIds={this.props.organizationUserIds}
          title={this.props.title}
          isInviteUserModalOpen={this.state.isInviteUserModalOpen}
          emailHumanMessageModel={this.state.emailHumanMessageModel}
          onCloseIviteUserModal={this.onCloseIviteUserModal}
          onInviteUserAndSubmit={this.onInviteUserAndSubmit}
          onClickSubmitButton={this.onClickSubmitButton}
          onEmailChange={this.onEmailChange}
          onSelectedEmailsChange={this.onSelectedEmailsChange}
          onSendInvitations={this.onSendInvitations}
          onSubmit={this.onSubmit}
          onKeyDown={this.onKeyDown}
          onSetInnerRef={this.onSetInnerRef}
          onBlur={this.onBlur}
        />
      );
    }

    onClickSubmitButton(event) {
      if (event) {
        event.preventDefault();
      }

      const emailValidationResult = isValidEmail(this.state.email, true);
      if (
        this.state.selectedEmails.size > 0 ||
        (this.state.email &&
          emailValidationResult &&
          emailValidationResult.isValid)
      ) {
        this.setState({ isInviteUserModalOpen: true });
      } else {
        this.onSubmit();
      }
    }

    onSubmit() {
      this.onCloseIviteUserModal();
      this.props.onSubmit();
      this.props.history.push('/');
    }

    onCloseIviteUserModal() {
      this.setState({ isInviteUserModalOpen: false });
    }

    onInviteUserAndSubmit() {
      if (this.state.email.length > 0 && !this.validateEmail()) {
        return;
      }
      this.onCloseIviteUserModal();
      this.onSendInvitations();
      this.onSubmit();
    }

    onSendInvitations() {
      if (
        this.state.selectedEmails.size === 0 &&
        this.state.email.length === 0
      ) {
        return false;
      }
      const users = this.getValidUsers();

      this.props.onInviteUsersToOrganization(users);
      return true;
    }

    getValidUsers() {
      const users = this.state.selectedEmails.map(this.onAddUser).toJS();

      if (this.state.email.length > 0) {
        if (this.validateEmail()) {
          users.push(this.onAddUser(this.state.email));
        } else {
          return users;
        }

        this.setState({ email: '' });
      }
      return users;
    }

    onAddUser(email) {
      UserTracker.track(UserTrackerEvent.memberInvited, {
        source: 'workspace-members',
      });
      return {
        userId: generatePushId(),
        email,
      };
    }

    onSelectedEmailsChange(selectedEmails) {
      this.setState({ selectedEmails });
    }

    onEmailChange(text) {
      if (!text) {
        this.setState({
          emailHumanMessageModel: null,
        });
      } else {
        // ok
      }

      this.setState({ email: text });
      if (!this.isEditing) {
        this.isEditing = true;
      }
    }

    validateEmail() {
      const validationEmailResult = isValidEmail(this.state.email, true);
      if (!validationEmailResult.isValid) {
        this.onEmailInvalid(validationEmailResult.message);
        return false;
      } else {
        const isEmailUniqueInOrganization =
          this.props.currentOrganizationPeopleEmails.indexOf(this.state.email) <
          0;
        const isEmailUniqueInSelection = !this.state.selectedEmails.includes(
          this.state.email
        );
        if (!isEmailUniqueInOrganization || !isEmailUniqueInSelection) {
          this.onEmailInvalid(
            'This user already is a member of your workspace.'
          );
          return false;
        }
      }

      this.setState({
        emailHumanMessageModel: null,
      });
      return true;
    }

    onEmailInvalid(text) {
      this.setState({
        emailHumanMessageModel: HumanMessage({
          text,
          kind: HumanMessageKind.error,
        }),
      });
    }

    onBlur() {
      if (this.isEditing && this.state.email.length > 0) {
        this.validateEmail();
      } else {
        this.setState({
          emailHumanMessageModel: null,
        });
      }
    }

    onSetInnerRef(ref) {
      this.innerRef = ref;
    }

    componentDidMount() {
      if (this.innerRef) {
        this.innerRef.focus();
      }
    }
  }

  function mapStateToProps(state, props) {
    return {
      isSubmitting: selectRequestIsLoading(state, {
        requestType: RequestTypes.createWorkspace,
        objectId: props.organizationId,
      }),
      organizationUserIds:
        OrganizationsModelSelectors.selectCurrentOrganizationActivePeopleWithoutBot(
          state
        ),
      currentOrganizationPeopleEmails:
        OrganizationsModelSelectors.selectCurrentOrganizationActivePeopleEmails(
          state
        ),
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      onInviteUsersToOrganization: (users) =>
        dispatch(OrganizationsModelActions.onInviteUsersToOrganization(users)),
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceWorkspaceInvitationsForm);
}

export default enhance;
