import React from 'react'
import PropTypes from 'prop-types'
import { Text } from 'react-native'
import { ellipsizeInTheEnd } from 'common/utils'

ProjectName.propTypes = {
  projectName: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
}

ProjectName.defaultProps = {
  projectName: '',
  maxLength: 0,
}

export default function ProjectName(props) {
  return (
    <Text style={props.styles}>
      {props.maxLength ? ellipsizeInTheEnd(props.projectName, props.maxLength) : props.projectName}
    </Text>
  )
}
