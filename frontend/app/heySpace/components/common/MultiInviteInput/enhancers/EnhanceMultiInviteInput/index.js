import React from "react";
import { connect } from "react-redux";
import { List } from "immutable";
import BaseComponent from "commonEnhancers/BaseComponent";
import { isValidEmail } from "common/utils/validation";
import {
  selectCurrentOrganizationActivePeopleEmails,
  selectCurrentOrganizationMemberUserIds,
} from "models/domain/OrganizationsModel/selectors";
import { HumanMessage } from 'models/domain/HumanMessageModel/models'
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types'
import { doNothing } from "common/utils";
import * as PopUpAlertsModelActions from "models/component/PopUpAlertsModel/actions";
import { i18n } from "i18n";
import { selectCurrentOrganizationOccupiedGuestSeatsCount } from "models/domain/GuestsModel/selectors";

const emptyList = new List();
const SPLITABLE_CHARACTERS = [",", ";", " "];

function enhance(ComposedComponent) {
  class EnhanceMultiInviteInput extends BaseComponent {
    static defaultProps = {
      isInvitingGuests: false,
      onChange: doNothing,
      onSelectedEmailsChange: doNothing,
      onSubmit: doNothing,
    };

    state = {
      value: "",
      selectedEmails: emptyList,
      error: this.props.emailHumanMessageModel,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          value={this.state.value}
          isSubmitDisabled={this.isSubmitDisabled()}
          selectedEmails={this.state.selectedEmails}
          error={this.state.error || this.props.emailHumanMessageModel}
          submitButtonLabel={this.props.submitButtonLabel}
          submitButtonClassName={this.props.submitButtonClassName}
          submitButtonRenderer={this.props.submitButtonRenderer}
          inputClassName={this.props.inputClassName}
          inputInnerClassName={this.props.inputInnerClassName}
          placeholder={this.props.placeholder}
          shouldRenderSubmitButton={this.props.shouldRenderSubmitButton}
          onChangeInput={this.onChangeInput}
          onInputBlur={this.onInputBlur}
          onRemoveEmail={this.onRemoveEmail}
          onInputKeyDown={this.onInputKeyDown}
          onSubmit={this.onSubmit}
          onSetInputRef={this.onSetInputRef}
        />
      );
    }

    onSetInputRef(input) {
      this.input = input;
    }

    onChangeInput(value) {
      this.setState({ value });

      const email = value.substring(0, value.length - 1);
      const isLastSpecialCharacter = SPLITABLE_CHARACTERS.includes(
        value[value.length - 1]
      );
      if (isValidEmail(email) && isLastSpecialCharacter) {
        this.addEmail(email);
      }
      this.props.onChange(value);
    }

    onInputBlur() {
      const { value } = this.state;
      if (value) {
        this.addEmail(value);
      }
    }

    isSubmitDisabled() {
      return (
        this.props.isDisabled ||
        (this.state.selectedEmails.size === 0 &&
          !isValidEmail(this.state.value))
      );
    }

    addEmail(email) {
      const isEmailUniqueInOrganization =
        this.props.currentOrganizationPeopleEmails.indexOf(email) < 0;
      const validationEmailResult = isValidEmail(email, true);
      if (!isEmailUniqueInOrganization || !validationEmailResult.isValid) {
        this.onEmailAlreadyTaken(validationEmailResult);
      } else {
        this.setState((prevState) => {
          if (prevState.selectedEmails.includes(email)) {
            return { ...prevState, error: null };
          } else {
            this.props.onChange("");
            const selectedEmails = prevState.selectedEmails.push(email);
            this.props.onSelectedEmailsChange(selectedEmails);
            return {
              selectedEmails,
              value: "",
              error: null,
            };
          }
        });
        setImmediate(() => {
          if (this.input) {
            this.input.focus();
          }
        });
      }
    }

    onEmailAlreadyTaken(validationEmailResult) {
      const error = HumanMessage({
        text: (validationEmailResult && validationEmailResult.message) || i18n.t('This user already is a member of your workspace.'),
        kind: HumanMessageKind.error,
      })
      this.setState({
        error,
      });
    }

    onInputKeyDown(event) {
      const { value } = event.target;
      const { key } = event;

      switch (key) {
        case "Backspace": {
          if (value === "") {
            this.setState((prevState) => {
              const selectedEmails = prevState.selectedEmails.pop();
              this.props.onSelectedEmailsChange(selectedEmails);
              return {
                selectedEmails,
              };
            });
          }
          break;
        }
        case "Enter": {
          if (value.length > 0) {
            this.addEmail(value);
          } else {
            this.onSubmit();
          }
          break;
        }
        case "Tab": {
          if (value.length > 0) {
            this.addEmail(value);
          }
          break;
        }
        default:
          break;
      }
    }

    onRemoveEmail(email) {
      this.setState((prevState) => {
        const emailIndex = prevState.selectedEmails.indexOf(email);
        if (emailIndex > -1) {
          const selectedEmails = prevState.selectedEmails.filter(
            (selectedEmail) => selectedEmail !== email
          );
          this.props.onSelectedEmailsChange(selectedEmails);
          return {
            selectedEmails,
          };
        } else {
          return prevState;
        }
      });
    }

    getValidEmails() {
      let { selectedEmails } = this.state;
      const email = this.state.value;
      const isEmailUniqueInOrganization =
        this.props.currentOrganizationPeopleEmails.indexOf(email) < 0;
      if (
        isValidEmail(email) &&
        !selectedEmails.includes(email) &&
        isEmailUniqueInOrganization
      ) {
        selectedEmails = selectedEmails.push(email);
      }
      if (!isEmailUniqueInOrganization) {
        this.onEmailAlreadyTaken();
      }
      return selectedEmails.toJS();
    }

    onSubmit() {
      const validEmails = this.getValidEmails();

      if (!this.isValidForm(validEmails)) {
        return null;
      }

      const submitted = this.props.onSubmit(validEmails);
      if (submitted) {
        this.setState({ selectedEmails: emptyList, value: "" });
        this.props.onSelectedEmailsChange(emptyList);
      }
      return true;
    }

    isValidForm(emails) {
      if (this.props.isInvitingGuests) {
        if (this.isInvitationGuestsToWorkspaceDisabled(emails)) {
          this.onInvalidGuestsInvitation();
          return false;
        }
      } else {
        if (this.isInvitationMembersToWorkspaceDisabled(emails)) {
          this.onInvalidMembersInvitation();
          return false;
        }
      }
      return true;
    }

    isInvitationMembersToWorkspaceDisabled() {
      return false;
    }

    onInvalidMembersInvitation() {}

    isInvitationGuestsToWorkspaceDisabled() {
      return false;
    }

    onInvalidGuestsInvitation() {}
  }

  function mapStateToProps(state) {
    return {
      currentOrganizationPeopleEmails:
        selectCurrentOrganizationActivePeopleEmails(state),
      occupiedGuestSeatCount:
        selectCurrentOrganizationOccupiedGuestSeatsCount(state),
      organizationUserIds: selectCurrentOrganizationMemberUserIds(state),
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      onAddAlert: (humanMessage, id) =>
        dispatch(PopUpAlertsModelActions.onAddAlert({ humanMessage }, id)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceMultiInviteInput);
}

export default enhance;
