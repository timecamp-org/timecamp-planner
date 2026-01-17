import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";

import { onGenerateInvitationLink } from "models/domain/OrganizationsModel/actions";
import { selectUserInvitationLink } from "models/domain/OrganizationsModel/selectors/domain";
import { selectUserEmail } from "../../../../../../../common/models/domain/UsersModel/selectors/domain";

function EnhanceDirectInvitationLinkModal(ComposedComponent) {
  class EnhanceDirectInvitationLinkModal extends BaseComponent {
    static propTypes = {
      userId: PropTypes.string.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          isModalOpen={this.props.isModalOpen}
          userEmail={this.props.userEmail}
          userInvitationLink={this.props.userInvitationLink}
          onSetIsModalOpen={this.props.onSetIsModalOpen}
          onSetInputRef={this.onSetInputRef}
          onCopyLink={this.onCopyLink}
        />
      );
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
        document.execCommand("copy");
      }
    }

    componentDidMount() {
      this.props.onGenerateInvitationLink();
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      userEmail: selectUserEmail(state, { userId: props.userId }),
      userInvitationLink: selectUserInvitationLink(state, {
        userId: props.userId,
      }),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onGenerateInvitationLink: () =>
      dispatch(onGenerateInvitationLink(props.userId)),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceDirectInvitationLinkModal);
}

export default EnhanceDirectInvitationLinkModal;
