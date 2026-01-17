import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'


import { selectTagNameById, selectTagColorById } from 'models/domain/TagsModel/selectors'

function Enhance(ComposedComponent) {
  class EnhanceTag extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      tagId: PropTypes.string.isRequired, 
    }

    render() {
      return (
        <ComposedComponent
          innerRef={this.props.innerRef}
          tagName={this.props.tagName}
          tagColor={this.props.tagColor}
        />
      )
    }

  }

  function mapStateToProps(state, props) {
    return {
      tagName: selectTagNameById(state, { tagId: props.tagId }),
      tagColor: selectTagColorById(state, { tagId: props.tagId }),
    }
  }

  return connect(mapStateToProps)(EnhanceTag)
}

export default Enhance
