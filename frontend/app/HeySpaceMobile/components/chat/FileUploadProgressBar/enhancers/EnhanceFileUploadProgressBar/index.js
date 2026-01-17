import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import { selectFileUploadProgress } from 'models/domain/FilesModel/selectors'

function Enhance(ComposedComponent) {
  class EnhanceFileUploadProgressBar extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      fileName: PropTypes.string.isRequired,
      progress: PropTypes.number.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          progressDisplay={this.props.progress / 100}
          fileName={this.props.fileName}
        />
      )
    }

  }

  const mapStateToProps = (state, props) => ({
    progress: selectFileUploadProgress(state, { fileId: props.id }),
  })

  return connect(mapStateToProps)(EnhanceFileUploadProgressBar)
}

export default Enhance
