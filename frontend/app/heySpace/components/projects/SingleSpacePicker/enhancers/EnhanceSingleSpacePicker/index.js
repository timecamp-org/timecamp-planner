import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "immutable-prop-types";
import { connect } from "react-redux";
import BaseComponent from "commonEnhancers/BaseComponent";
import { doNothing } from "common/utils";
import { List } from "immutable";

import { selectAvailableSpacesIds } from "models/domain/ProjectsModel/selectors";

function Enhance(ComposedComponent) {
  class EnhanceSingleSpacePicker extends BaseComponent {
    static propTypes = {
      excludedProjectIds: ImmutablePropTypes.list,
      selectedSpaceId: PropTypes.string,
      onSelectedSpaceChange: PropTypes.func,
    };

    static defaultProps = {
      excludedProjectIds: new List(),
      onSelectedSpaceChange: doNothing,
    };

    state = {
      selectedSpaceId: this.props.selectedSpaceId,
      isOpen: false,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          spaceIds={this.getSpaceIds()}
          selectedSpaceId={this.state.selectedSpaceId}
          isOpen={this.state.isOpen}
          isDisabled={this.props.isDisabled}
          onSelectSpaceId={this.onSelectSpaceId}
          onClickButtonDispatched={this.onClickButtonDispatched}
        />
      );
    }

    getSpaceIds() {
      return this.props.spaceIds.filter(
        (projectId) => !this.props.excludedProjectIds.includes(projectId)
      );
    }

    onSelectSpaceId(selectedSpaceId) {
      this.setState({ selectedSpaceId });
      this.props.onSelectedSpaceChange(selectedSpaceId);
      this.setState({ isOpen: false });
    }

    onClickButtonDispatched() {
      this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
    }

    componentDidUpdate(prevProps) {
      if (prevProps.selectedSpaceId !== this.props.selectedSpaceId) {
        this.setState({ selectedSpaceId: this.props.selectedSpaceId });
      }
    }
  }

  function mapStateToProps(state) {
    return {
      spaceIds: selectAvailableSpacesIds(state),
    };
  }

  return connect(mapStateToProps)(EnhanceSingleSpacePicker);
}

export default Enhance;
