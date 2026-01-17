import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import isBefore from "date-fns/is_before";
import isSameDay from "date-fns/is_same_day";
import BaseComponent from "commonEnhancers/BaseComponent";
import {
  jungleGreenColor,
  paleRedColor,
  macaroniAndCheeseColor,
} from "styles/colors.css";

import * as TasksSelectors from "models/domain/TasksModel/selectors";

export default function enhance(Component) {
  class EnhanceWithTaskDueDateColor extends BaseComponent {
    static propTypes = {
      taskId: PropTypes.string.isRequired,
      className: PropTypes.string,
      format: PropTypes.string,
      isColorsHidden: PropTypes.bool,
      dueDate: PropTypes.number.isRequired,
    };

    render() {
      return <Component {...this.props} color={this.getColor()} />;
    }

    isDueDateToday() {
      return isSameDay(this.props.dueDate, new Date());
    }

    getColor() {
      if (this.props.taskProgress === 100) {
        return jungleGreenColor;
      }

      if (this.isDueDateToday()) {
        return macaroniAndCheeseColor;
      }

      if (isBefore(this.props.dueDate, new Date())) {
        return paleRedColor;
      }

      return undefined;
    }
  }

  const mapStateToProps = (state, props) => ({
    taskProgress: TasksSelectors.selectTaskProgressEstimate(state, {
      taskId: props.taskId,
    }),
  });

  return connect(mapStateToProps, null)(EnhanceWithTaskDueDateColor);
}
