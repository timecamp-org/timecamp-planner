import React from 'react'
import { doNothing } from 'common/utils'
import { useDropzone } from 'react-dropzone'

DropzoneWrapper.defaultProps = {
  onSetOpenCallback: doNothing,
}

export default function DropzoneWrapper(props) {
  const { className, style, children, onSetOpenCallback, ...dropzoneProps } = props
  const { getRootProps, getInputProps, open } = useDropzone(dropzoneProps)
  onSetOpenCallback(open)
  const rootProps = getRootProps({
    className: className,
    style: style,
  })
  return (
    <div
      {...rootProps}>
      <input {...getInputProps()} />
      {children}
    </div>
  )
}
