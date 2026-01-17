import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import { selectSpaceColor } from 'models/mobile/CreateSpaceModel/selectors'
import { onChangeSpaceColor } from 'models/mobile/CreateSpaceModel/actions'
import ProjectColors from 'common/commonStyles/projectColors'

const colorsWithNames = ProjectColors.getProjectColorsWithNames()

function enhance(ComposedComponent) {
  class EnhanceCreateSpaceColorScreen extends BaseComponent {

    static propTypes = {
      spaceColor: PropTypes.string.isRequired,
      onChangeSpaceColor: PropTypes.func.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          colorsWithNames={colorsWithNames}
          selectedColor={this.props.selectedColor}
          onChangeSpaceColor={this.props.onChangeSpaceColor}
        />
      )
    }

  }

  const mapStateToProps = (state, props) => ({
    selectedColor: selectSpaceColor(state),
  })

  const mapDispatchToProps = (dispatch, props) => ({
    onChangeSpaceColor: (spaceColor) => dispatch(onChangeSpaceColor(spaceColor)),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceCreateSpaceColorScreen)
}

export default enhance
