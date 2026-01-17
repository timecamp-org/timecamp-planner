import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'
import { selectUserEmail } from 'models/domain/UsersModel/selectors/domain'

function Enhance(ComposedComponent) {
  class EnhancePersonEmail extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      userId: PropTypes.string.isRequired,
      userEmail: PropTypes.string.isRequired,
    }


    render() {
      return (
        <ComposedComponent
          style={this.props.style}
          userEmail={this.props.userEmail}
        />
      )
    }

  }

  const mapStateToProps = (state, props) => {
    return {
      userEmail: selectUserEmail(state, { userId: props.userId }),
    }
  }

  return connect(mapStateToProps)(EnhancePersonEmail)
}

export default Enhance
