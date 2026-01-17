import React from 'react'
import PropTypes from 'prop-types'
import { Text } from 'react-native'

ListName.propTypes = {
  listName: PropTypes.string.isRequired,
}

ListName.defaultProps = {
  listName: '',
}

export default function ListName(props) {
  return (
    <Text style={props.styles}>
      {props.listName}
    </Text>
  )
}
