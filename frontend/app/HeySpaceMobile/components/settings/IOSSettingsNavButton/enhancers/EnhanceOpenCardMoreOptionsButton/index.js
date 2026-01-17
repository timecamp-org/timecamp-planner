import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import MoreVertical from 'components/Icons/MoreVertical'
import styles from '../../styles'
import { blackColor } from 'common/commonStyles/colors'
import { selectIsCardMoreOptionsActionSheetOpened } from 'models/mobile/NavigationModel/selectors'
import * as NavigationModelActions from 'models/mobile/NavigationModel/actions'

function enhance(ComposedComponent) {
  class EnhanceOpenCardMoreOptionsButton extends BaseComponent {

    static propTypes = {
      isCardMoreOptionsActionSheetOpened: PropTypes.bool.isRequired,
      onSetIsCardMoreOptionsActionSheetOpened: PropTypes.func.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          icon={<MoreVertical svgProps={{ style: styles.moreVerticalIcon }} currentColor={blackColor} />}
          onPress={this.onToggleCardMoreOptionsActionSheet}
        />
      )
    }

    onToggleCardMoreOptionsActionSheet() {
      this.props.onSetIsCardMoreOptionsActionSheetOpened(!this.props.isCardMoreOptionsActionSheetOpened)
    }

  }

  const mapStateToProps = (state, props) => ({
    isCardMoreOptionsActionSheetOpened: selectIsCardMoreOptionsActionSheetOpened(state),
  })

  const mapDispatchToProps = (dispatch, props) => ({
    onSetIsCardMoreOptionsActionSheetOpened: (isOpened) => dispatch(NavigationModelActions.onSetIsCardMoreOptionsActionSheetOpened(isOpened)),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceOpenCardMoreOptionsButton)
}

export default enhance
