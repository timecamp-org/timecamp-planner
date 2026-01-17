import React from 'react'
import PropTypes from 'prop-types'

RenderedTaskDescription.propTypes = {
  markdownOutput: PropTypes.array,
}

RenderedTaskDescription.defaultProps = {
  markdownOutput: [],
}

function RenderedTaskDescription(props) {
  return (
    <div className={props.className}>
      {props.markdownOutput.map((element, index) => (
        <React.Fragment key={`task-description-${index}`}>
          {element}
        </React.Fragment>
      ))}
    </div>
  )
}

export default RenderedTaskDescription
