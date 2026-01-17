import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";
import ReactHoverObserver from "react-hover-observer";
import { selectTaskColor } from "models/domain/TasksModel/selectors";
import * as AppModelActions from "models/domain/AppModel/actions";

function Enhance(ComposedComponent) {
  class EnhanceCardEventAgenda extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      event: PropTypes.object.isRequired,
    };

    render() {
      return (
        <ReactHoverObserver>
          <ComposedComponent
            event={this.props.event}
            color={this.props.color}
            onClick={this.onClick}
          />
        </ReactHoverObserver>
      );
    }

    onClick() {
      this.props.onOpenCardDetailsModal(this.props.event.id);
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      color: selectTaskColor(state, { taskId: props.event.id }),
    };
  };

  function mapDispatchToProps(dispatch, props) {
    return {
      onOpenCardDetailsModal: (taskId) =>
        dispatch(AppModelActions.onSetOpenedCardDetailsModalId(taskId)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceCardEventAgenda);
}

export default Enhance;
