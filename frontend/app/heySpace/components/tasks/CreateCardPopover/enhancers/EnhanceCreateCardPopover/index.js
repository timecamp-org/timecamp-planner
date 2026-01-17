import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BaseComponent from "commonEnhancers/BaseComponent";
import { doNothing } from "common/utils";
import { Map } from "immutable";
import { selectProjectColor } from "models/domain/ProjectsModel/selectors";

const TIMEOUT_TO_CLOSE_POPOVER = 1000;
const emptyMap = new Map();

function Enhance(ComposedComponent) {
  class EnhanceCreateCardPopover extends BaseComponent {
    static propTypes = {
      projectId: PropTypes.string.isRequired,
    };

    static defaultProps = {
      onClosePopover: doNothing,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          targetClassName={this.props.targetClassName}
          isPopoverOpened={this.props.isPopoverOpened}
          taskCreateSource={this.props.taskCreateSource}
          color={this.props.color}
          startDate={this.props.startDate}
          dueDate={this.props.dueDate}
          projectId={this.props.projectId}
          onClosePopover={this.props.onClosePopover}
          onClickOutside={this.onClickOutside}
        />
      );
    }

    onClickOutside() {
      // here: it's a brutal hack ;/ but no idea how to prevent clickOutside here for time grid full calendar
      if (this.isAbleToClosePopover) {
        this.props.onClosePopover();
      }
    }

    componentDidMount() {
      this.popoverTimeout = setTimeout(() => {
        this.isAbleToClosePopover = true;
      }, TIMEOUT_TO_CLOSE_POPOVER);
    }

    componentWillUnmount() {
      if (this.popoverTimeout) {
        clearTimeout(this.popoverTimeout);
      }
    }
  }

  function mapStateToProps(state, props) {
    return {
      color: selectProjectColor(state, { projectId: props.projectId }),
    };
  }

  return connect(mapStateToProps)(EnhanceCreateCardPopover);
}

export default Enhance;
