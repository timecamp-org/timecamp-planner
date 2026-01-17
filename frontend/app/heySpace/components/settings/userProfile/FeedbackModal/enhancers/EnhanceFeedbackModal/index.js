import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";
import { selectCurrentOrganizationId } from "../../../../../../../common/models/domain/OrganizationsModel/selectors/domain";
import { onSendUserFeedback } from "../../../../../../../common/models/domain/CurrentUserModel/actions";
import getMeaningfulFeedbackPointsValues from "./getMeaningfulFeedbackPointsValues";

function enhance(ComposedComponent) {
  class EnhanceFeedbackModal extends BaseComponent {
    static propTypes = {
      isModalOpen: PropTypes.bool.isRequired,
      onSetIsModalOpened: PropTypes.func.isRequired,

      currentOrganizationId: PropTypes.string.isRequired,
      onSendFeedback: PropTypes.func.isRequired,
    };

    state = {
      additionalFeedback: "",
    };

    feedbackPointsValues = {};

    render() {
      return (
        <ComposedComponent
          isModalOpen={this.props.isModalOpen}
          additionalFeedback={this.state.additionalFeedback}
          onSetIsModalOpened={this.props.onSetIsModalOpened}
          onSetFeedbackPointValue={this.onSetFeedbackPointValue}
          onChangeAdditionalFeedback={this.onChangeAdditionalFeedback}
          onSendFeedback={this.onSendFeedback}
        />
      );
    }

    onChangeAdditionalFeedback(event) {
      this.setState({
        additionalFeedback: event.target.value,
      });
    }

    onSetFeedbackPointValue(feedbackPointName) {
      return (value) => {
        this.feedbackPointsValues[feedbackPointName] = value;
      };
    }

    onSendFeedback(feedbackType) {
      const meaningfulFeedbackPointValues = getMeaningfulFeedbackPointsValues(
        this.feedbackPointsValues,
        this.state.additionalFeedback
      );

      const feedback = {
        organizationId: this.props.currentOrganizationId,
        ...meaningfulFeedbackPointValues,
      };

      this.props.onSendFeedback(feedback, feedbackType);
    }

    resetState() {
      this.feedbackPointsValues = {};
      this.setState({
        additionalFeedback: "",
      });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      if (prevProps.isModalOpen && !this.props.isModalOpen) {
        this.resetState();
      }
    }
  }

  const mapStateToProps = (state, props) => ({
    currentOrganizationId: selectCurrentOrganizationId(state),
  });

  const mapDispatchToProps = (dispatch, props) => ({
    onSendFeedback: (feedback, feedbackType) => dispatch(onSendUserFeedback({ feedback, feedbackType})),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceFeedbackModal);
}

export default enhance;
