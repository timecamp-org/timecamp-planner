import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";
import { FeedbackType } from "../../../../../../../common/models/domain/CurrentUserModel/constants/userFeedbackType";
import { i18n } from "i18n/index";
import { cancelSubscriptionFeedbackPoints } from "../../feedbackPoints";
import { selectCurrentOrganizationId } from "../../../../../../../common/models/domain/OrganizationsModel/selectors/domain";

function enhance(ComposedComponent) {
  class EnhanceDeleteAccountModal extends BaseComponent {
    static propTypes = {
      isModalOpen: PropTypes.bool.isRequired,
      additionalFeedback: PropTypes.string.isRequired,

      onSetIsModalOpened: PropTypes.func.isRequired,
      onSetFeedbackPointValue: PropTypes.func.isRequired,
      onChangeAdditionalFeedback: PropTypes.func.isRequired,
      onSendFeedback: PropTypes.func.isRequired,

      // injected
      organizationId: PropTypes.string.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          // modal content props
          isModalOpen={this.props.isModalOpen}
          header={i18n.t(`TELL US WHY YOU'RE CANCELLING YOUR SUBSCRIPTION`)}
          saveButtonCaption={i18n.t("Send and cancel subscription")}
          cancelButtonCaption={i18n.t("Keep subscription")}
          additionalFeedbackLabel={i18n.t(
            `What could we do to make you stay with us in the Premium plan?`
          )}
          subtitle={i18n.t(
            "Before you cancel subscription, please tell us how can we improve.\nWhy are you cancelling your organization subscription?"
          )}
          feedbackPoints={cancelSubscriptionFeedbackPoints}
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
      this.props.onSendFeedback(FeedbackType.SUBSCRIPTION_CANCELATION);
    }
  }

  const mapStateToProps = (state, props) => ({
    organizationId: selectCurrentOrganizationId(state),
  });

  return connect(mapStateToProps)(EnhanceDeleteAccountModal);
}

export default enhance;
