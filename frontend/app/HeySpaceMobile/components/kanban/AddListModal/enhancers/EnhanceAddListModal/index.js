import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'

import { selectProjectColor } from 'models/domain/ProjectsModel/selectors'
import { onCreateList } from 'models/domain/ListsModel/actions'

function Enhance(ComposedComponent) {
  class EnhanceAddListModal extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      projectId: PropTypes.string.isRequired,
    }

    state = {
      name: '',
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}

          onChangeText={this.onChangeText}
          onSubmit={this.onSubmit}
          onCancel={this.onCancel}
        />
      )
    }

    onChangeText(name) {
      this.setState({ name })
    }

    onSubmit() {
      this.onCreateList(this.state.name)
    }

    onCancel() {
      this.setState({
        name: '',
      })
      this.props.onClose()
    }

    onCreateList(name) {
      this.props.onCreateList(name)
      this.props.onClose()
    }

  }

  function mapStateToProps(state, props) {
    return {
      color: selectProjectColor(state, { projectId: props.projectId }),
    }
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onCreateList: (name) => dispatch(onCreateList({
        projectId: props.projectId,
        name,
        createAtTheBottom: true,
      })),
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceAddListModal)
}

export default Enhance
