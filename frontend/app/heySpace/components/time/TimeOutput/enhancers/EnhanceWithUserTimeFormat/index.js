import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'


import {
  selectUserTimeFormat,
} from 'models/domain/UsersModel/selectors/domain'

function Enhance(ComposedComponent) {
  class EnhanceWithUserTimeFormat extends React.Component { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      format: PropTypes.string,
      userId: PropTypes.string,
      userTimeFormat: PropTypes.string.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          userTimeFormat={this.props.format || this.props.userTimeFormat}
          shouldDisplayDate={this.props.shouldDisplayDate}
        />
      )
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      userTimeFormat: selectUserTimeFormat(state, { userId: props.userId }),
    }
  }

  function mapDispatchToProps(dispatch) {
    return {
      dispatch,

    }
  }
  return connect(mapStateToProps, mapDispatchToProps)(EnhanceWithUserTimeFormat)
}

export default Enhance
