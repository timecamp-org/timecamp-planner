import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'

import { Map } from 'immutable'

import { selectTagsIdsList } from 'models/domain/TagsModel/selectors'

function Enhance(ComposedComponent) {
  class EnhanceTagList extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      objectId: PropTypes.string.isRequired,
    }

    state = {
      visibleTagsCount: this.props.tagIds.size,
    }

    tagsRef = new Map()    

    render() {
      return (
        <ComposedComponent
          tagIds={this.props.tagIds}
          styles={this.props.styles}

          visibleTagsCount={this.state.visibleTagsCount}

          onLayout={this.onLayout}
          onSetTagRef={this.onSetTagRef}
        />
      )
    }

    onLayout(event) {
      const { x, y, width, height } = event.nativeEvent.layout

      // TODO: calculate count
//       this.tagsRef.forEach((ref, tagId) => {
// // ?        const { x, y, width, height } = event.nativeEvent.layout

//       })

      // this.setState({
      //   visibleTagsCount: 3,
      // })
    }

    onSetTagRef(tagId, ref) {
      this.tagsRef = this.tagsRef.set(tagId, ref)
    }

  }

  function mapStateToProps(state, props) {
    return {
      tagIds: selectTagsIdsList(state, { objectId: props.objectId }),
    }
  }

  return connect(mapStateToProps)(EnhanceTagList)
}

export default Enhance
