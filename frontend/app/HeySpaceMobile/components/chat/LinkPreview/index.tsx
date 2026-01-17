import React, { memo } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'

import styles from './styles'
import { AnyDict } from 'common/types'
import { Id } from 'common/utils/identifier'
import useComponent, { LinkPreviewHookInterface } from './hook'
import FitImage from 'react-native-fit-image'

export type LinkPreviewInterface = {
  messageId: Id,
  url: string,
  linkText?: string,
  linkTitle?: string,
  style?: AnyDict,
  shouldRenderUrl?: boolean,
}

const LinkPreview: React.FC<LinkPreviewInterface> = (props) => {
  const hook = useComponent(props)

  return (
    <TouchableOpacity
      style={props.style || styles.Component}
      onPress={hook.onPress}
    >
      {props.shouldRenderUrl && <Text
        onPress={hook.onPress}
      >
        {props.linkText || props.url}
      </Text>
      }
      {hook.isLinkPreviewEnabled ? renderPreview(hook) : null}
    </TouchableOpacity>
  )
}

function renderPreview(hook: LinkPreviewHookInterface) {
  return (
    <View style={hook.title ? styles.previewContainer : {}}>
      {hook.publisher && renderPublisher(hook)}
      {hook.title && renderTitle(hook)}
      {hook.description && renderDescription(hook)}
      {hook.shouldRenderImage && renderImageContent(hook)}
    </View>
  )
}

function renderImageContent(hook: LinkPreviewHookInterface) {
  return <FitImage
    indicator={false}
    source={{ uri: hook.imageUrl || hook.url }}
    style={styles.image}
  />
}

function renderPublisher(hook: LinkPreviewHookInterface) {
  return (
    <View style={styles.publisher}>
      {hook.logo && <FitImage
        source={{ uri: hook.logo }}
        style={styles.logo}
        indicator={false}
      />}
      <Text>{hook.publisher}</Text>
    </View>
  )
}

function renderTitle(props) {
  return (
    <Text
      onPress={props.onClick}
    >
      <Text
        style={styles.title}
      >
        {props.title}
      </Text>
    </Text>
  )
}

function renderDescription(props) {
  return (
    <Text>{props.description}</Text>
  )
}

export default memo(LinkPreview)
