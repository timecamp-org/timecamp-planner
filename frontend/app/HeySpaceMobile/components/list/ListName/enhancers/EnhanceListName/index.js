import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'

import { selectListName } from 'models/domain/ListsModel/selectors'

function Enhance(ComposedComponent) {
  class EnhanceListName extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      listId: PropTypes.string.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          listName={this.props.listName}
          styles={this.props.styles}
        />
      )
    }

  }

  function mapStateToProps(state, props) {
    return {
      listName: selectListName(state, { listId: props.listId }),
    }
  }

  return connect(mapStateToProps)(EnhanceListName)
}

export default Enhance
