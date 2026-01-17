import PropTypes from 'prop-types'

ExtensionVisibilityWrapper.propTypes = {
  isEnabled: PropTypes.bool,
}

function ExtensionVisibilityWrapper(props) {
  if (!props.isEnabled) {
    return null
  }

  return props.children
}

export default ExtensionVisibilityWrapper
