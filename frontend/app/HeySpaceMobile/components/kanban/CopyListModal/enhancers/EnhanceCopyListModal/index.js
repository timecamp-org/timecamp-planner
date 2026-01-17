import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'

import { selectListColor, selectProjectIdByListId, selectListName } from 'models/domain/ListsModel/selectors'
import { onCopyList } from 'models/domain/ListsModel/actions'

function Enhance(ComposedComponent) {
  class EnhanceCopyListModal extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

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
          listColor={this.props.listColor}

          onChangeText={this.onChangeText}
          onSubmit={this.onSubmit}
          onCancel={this.onCancel}
        />
      )
    }

    onChangeText(name) {
      this.setState({
        name,
      })
    }

    onSubmit() {
      const { name } = this.state

      this.props.onCopyTaskList(name)
      this.props.onClose()
    }

    onCancel() {
      this.props.onClose()
    }

  }

  const mapStateToProps = (state, props) => {
    return {
      projectId: selectProjectIdByListId(state, { listId: props.listId }),
      listColor: selectListColor(state, { listId: props.listId }),
      listName: selectListName(state, { listId: props.listId }),
    }
  }

  const mapDispatchToProps = (dispatch, props) => ({
    onCopyTaskList: (listName) => dispatch(onCopyList(props.listId, listName))
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceCopyListModal)
}

export default Enhance
