import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'


import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'

function Enhance(ComposedComponent) {
  class EnhanceWithCurrentUserId extends React.Component {

    static propTypes = {
      userId: PropTypes.string,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
        />
      )
    }
  }

  const mapStateToProps = (state) => {
    return {
      userId: selectCurrentUserId(state),
    }
  }

  return connect(mapStateToProps)(EnhanceWithCurrentUserId)
}

export default Enhance
