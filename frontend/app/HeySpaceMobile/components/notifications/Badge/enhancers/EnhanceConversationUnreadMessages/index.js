import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import { selectProjectUnreadMessagesCount } from 'models/domain/NotificationsModel/selectors'
import { whiteFourColor } from 'common/commonStyles/colors'

function enhance(ComposedComponent) {

  class EnhanceConversationUnreadMessages extends BaseComponent {

    static propTypes = {
      spaceId: PropTypes.string.isRequired,

      count: PropTypes.number.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          count={this.props.count}
          color={whiteFourColor}
          textColor={this.props.textColor}
          style={this.props.style}
          smallTextStyle={this.props.smallTextStyle}
          normalTextStyle={this.props.normalTextStyle}
        />
      )
    }

  }

  const mapStateToProps = (state, props) => {
    return {
      count: selectProjectUnreadMessagesCount(state, { projectId: props.spaceId }),
    }
  }


  return connect(mapStateToProps)(EnhanceConversationUnreadMessages)
}

export default enhance
