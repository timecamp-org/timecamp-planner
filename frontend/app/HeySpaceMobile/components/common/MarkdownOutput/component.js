import React from 'react'

import unescape from 'lodash/unescape'
import { MarkdownView } from 'react-native-markdown-view'

export default function MarkdownOutput(props) {
  return (
    <MarkdownView rules={props.rules}>
      {unescape(props.text)}
    </MarkdownView>
  )
}
