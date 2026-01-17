import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";
import { onDeleteAccount } from "../../../../../../../common/models/domain/CurrentUserModel/actions";
import { FeedbackType } from "../../../../../../../common/models/domain/CurrentUserModel/constants/userFeedbackType";
import { i18n } from "i18n/index";
import { deleteAccountFeedbackPoints } from "../../feedbackPoints";

function enhance(ComposedComponent) {
  class EnhanceDeleteAccountModal extends BaseComponent {
    static propTypes = {
      isModalOpen: PropTypes.bool.isRequired,
      additionalFeedback: PropTypes.string.isRequired,

      onSetIsModalOpened: PropTypes.func.isRequired,
      onSetFeedbackPointValue: PropTypes.func.isRequired,
      onChangeAdditionalFeedback: PropTypes.func.isRequired,
      onSendFeedback: PropTypes.func.isRequired,

      onDeleteAccount: PropTypes.func.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          // modal content props
          isModalOpen={this.props.isModalOpen}
          header={i18n.t(`TELL US WHY YOU'RE DELETING YOUR ACCOUNT`)}
          saveButtonCaption={i18n.t("Send and delete my account")}
          cancelButtonCaption={i18n.t("Keep my account")}
          additionalFeedbackLabel={i18n.t(`What could we do to improve?`)}
          subtitle={i18n.t(
            "Before you go, please tell us how can we improve.\nWhy are you deleting your account?"
          )}
          feedbackPoints={deleteAccountFeedbackPoints}
          // rest props
          additionalFeedback={this.props.additionalFeedback}
          onSetIsModalOpened={this.props.onSetIsModalOpened}
          onSetFeedbackPointValue={this.props.onSetFeedbackPointValue}
          onChangeAdditionalFeedback={this.props.onChangeAdditionalFeedback}
          onSendFeedback={this.onSendFeedback}
        />
      );
    }

    onSendFeedback() {
      this.props.onDeleteAccount();
      this.props.onSendFeedback(FeedbackType.ACCOUNT_DELETED);
    }
  }

  const mapDispatchToProps = (dispatch, props) => ({
    onDeleteAccount: () => dispatch(onDeleteAccount()),
  });

  return connect(null, mapDispatchToProps)(EnhanceDeleteAccountModal);
}

export default enhance;
