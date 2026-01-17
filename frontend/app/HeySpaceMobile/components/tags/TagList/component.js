import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'

import { View } from 'react-native'

import Tag from 'components/tags/Tag'

TagList.propTypes = {

}

function TagList(props) {
  return (
    <View
      ref={props.onSetRef}
      style={props.styles || styles.container}
      onLayout={props.onLayout}
    >
      {
        props.tagIds.slice(0, props.visibleTagsCount).map(renderTag)
      }
    </View>
  )

  function renderTag(tagId) {
    return (
      <Tag
        key={tagId}
        innerRef={(ref) => props.onSetTagRef(tagId, ref)}
        tagId={tagId}
      />
    )
  }
}

export default TagList
