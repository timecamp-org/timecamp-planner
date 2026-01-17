import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'

import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import { selectListColor, selectListName } from 'models/domain/ListsModel/selectors'
import { onUpdateList } from 'models/domain/ListsModel/actions'

function Enhance(ComposedComponent) {
  class EnhanceEditListNameModal extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      listId: PropTypes.string.isRequired,
    }

    state = {
      name: this.props.listName,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}

          name={this.state.name}

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
      this.props.onChangeListName(this.state.name)
      this.props.onClose()
    }

    onCancel() {
      this.setState({
        name: '',
      })
      this.props.onClose()
    }

  }

  function mapStateToProps(state, props) {
    return {
      userId: selectCurrentUserId(state),
      listColor: selectListColor(state, { listId: props.listId }),
      listName: selectListName(state, { listId: props.listId }),
    }
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onChangeListName: (name) => dispatch(onUpdateList(props.listId, { name })),
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceEditListNameModal)
}

export default Enhance
