import React from 'react'

function FileUpload(props) {
  return props.children(props.openFilePicker)
}

export default FileUpload
