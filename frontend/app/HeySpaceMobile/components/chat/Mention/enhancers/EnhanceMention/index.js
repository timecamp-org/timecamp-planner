import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'

import { selectUserNickname } from 'models/domain/UsersModel/selectors/domain'
import { MentionType } from 'models/domain/MessagesModel/types'

function enhance(ComposedComponent) {
  class EnhanceMention extends BaseComponent {

    static propTypes = {
      userId: PropTypes.string,
      username: PropTypes.string,
      color: PropTypes.string,
    }

    render() {
      return <ComposedComponent
        displayValue={this.props.type === MentionType.USER ? this.props.username : this.props.value}
        color={this.props.color}
      />
    }

  }

  function mapStateToProps(state, props) {
    return {
      username: selectUserNickname(state, { userId: props.userId }),
    }
  }

  return connect(mapStateToProps)(EnhanceMention)
}

export default enhance
