import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import { selectSpaceIsPrivate } from 'models/mobile/CreateSpaceModel/selectors'
import { onChangeSpaceIsPrivate } from 'models/mobile/CreateSpaceModel/actions'

function enhance(ComposedComponent) {
  class EnhanceCreateSpacePrivacyScreen extends BaseComponent {

    static propTypes = {
      isSpacePrivate: PropTypes.bool.isRequired,
      onChangeSpaceIsPrivate: PropTypes.func.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          isSpacePrivate={this.props.isSpacePrivate}
          onSetSpaceIsPublic={this.onSetSpaceIsPublic}
          onSetSpaceIsPrivate={this.onSetSpaceIsPrivate}
        />
      )
    }

    onSetSpaceIsPublic() {
      this.props.onChangeSpaceIsPrivate(false)
    }

    onSetSpaceIsPrivate() {
      this.props.onChangeSpaceIsPrivate(true)
    }

  }

  const mapStateToProps = (state, props) => ({
    isSpacePrivate: selectSpaceIsPrivate(state),
  })

  const mapDispatchToProps = (dispatch, props) => ({
    onChangeSpaceIsPrivate: (isPrivate) => dispatch(onChangeSpaceIsPrivate(isPrivate)),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceCreateSpacePrivacyScreen)
}

export default enhance
