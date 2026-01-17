import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import BaseComponent from 'commonEnhancers/BaseComponent';
import ReactHoverObserver from 'react-hover-observer';
import { selectTaskColor } from 'models/domain/TasksModel/selectors';

function Enhance(ComposedComponent) {
  class EnhanceCardEventMonth extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      event: PropTypes.object.isRequired,
    };

    render() {
      return (
        <ReactHoverObserver>
          <ComposedComponent event={this.props.event} color={this.props.color} />
        </ReactHoverObserver>
      );
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      color: selectTaskColor(state, { taskId: props.event.id }),
    };
  };

  return connect(mapStateToProps)(EnhanceCardEventMonth);
}

export default Enhance;
