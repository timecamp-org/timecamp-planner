import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BaseComponent from 'commonEnhancers/BaseComponent';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';
import { onMemberRemove } from 'models/domain/ProjectsModel/actions';
import EnhanceWithRouter from 'enhancers/EnhanceWithRouter';

function Enhance(ComposedComponent) {
  @EnhanceWithRouter()
  class EnhanceLeaveSpaceController extends BaseComponent {
    static propTypes = {
      projectId: PropTypes.string.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          projectId={this.props.projectId}
          color={this.props.color}
          onLeaveSpace={this.onLeaveSpace}
        />
      );
    }

    onLeaveSpace() {
      this.props.onMemberRemove(this.props.currentUserId);
    }
  }

  const mapStateToProps = (state, props) => ({
    currentUserId: selectCurrentUserId(state),
  });

  function mapDispatchToProps(dispatch, props) {
    return {
      onMemberRemove: (userId) =>
        dispatch(onMemberRemove(props.projectId, userId)),
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceLeaveSpaceController);
}

export default Enhance;
