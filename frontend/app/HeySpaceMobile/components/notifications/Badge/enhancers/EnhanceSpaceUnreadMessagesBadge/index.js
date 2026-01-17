import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import { selectProjectUnreadMessagesCount } from 'models/domain/NotificationsModel/selectors'
import { selectProjectColor } from 'models/domain/ProjectsModel/selectors'

function enhance(ComposedComponent) {

  class EnhanceSpaceUnreadMessagesBadge extends BaseComponent {

    static propTypes = {
      spaceId: PropTypes.string.isRequired,

      count: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          count={this.props.count}
          color={this.props.color}
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
      count: selectProjectUnreadMessagesCount(state, { projectId: props.spaceId, objectId: props.spaceId }),
      color: selectProjectColor(state, { projectId: props.spaceId }),
    }
  }


  return connect(mapStateToProps)(EnhanceSpaceUnreadMessagesBadge)
}

export default enhance
