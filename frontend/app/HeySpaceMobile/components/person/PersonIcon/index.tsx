import React, { FC } from 'react'
import { View, Text, Image } from 'react-native'
import styles from './styles'
import { mediumFontSize } from 'styles/common'
import Assets from 'common/commonAssets'
import { AnyDict } from 'common/types'
import { Id } from '../../../../common/utils/identifier'
import useComponent, { PersonIconHookInterface } from './hook'

export type PersonIconInterface = {
  userId: Id,
  size?: number,
  style?: AnyDict,
  shouldRenderImageAvatar?: boolean
  showOnlineIndicator?: boolean
}

const defaultProps = {
  shouldRenderImageAvatar: true,
  showOnlineIndicator: true,
  size: 36,
}

const PersonIcon: FC<PersonIconInterface> = (props) => {
  const hook = useComponent(props)
  return (
    <View style={hook.isUserActive ? props.style : {...props.style, ...styles.deactivated }}>
      {hook.isBot ? renderBot(props, hook) : renderUser(props, hook)}
    </View>
  )
}

function renderBot(
  props: PersonIconInterface,
  hook: PersonIconHookInterface,
  ) {
  return (
    <Image
      source={{ uri: Assets.CHARACTER_14 }}
      style={getCircleStyle(props, hook)}
    />
  )
}

function renderUser(
  props: PersonIconInterface,
  hook: PersonIconHookInterface,
) {
  return props.shouldRenderImageAvatar && hook.avatarUrl
    ? (
      <Image
        source={{ uri: hook.avatarUrl }}
        style={getCircleStyle(props, hook)}
      />
    )
    : (
      <View style={getCircleStyle(props, hook)}>
        <Text numberOfLines={1} style={{ ...styles.initialsText, fontSize: getInitialsFontSize(props.size) }}>
          {hook.userInitials}
        </Text>
      </View>
    )
}

function getCircleStyle(
  props: PersonIconInterface,
  hook: PersonIconHookInterface,
) {
  return {
    ...styles.circle,
    width: props.size,
    height: props.size,
    borderRadius: (props.size / 2),
    ...getOnlineIndicatorStyle(hook),
  }
}

function getInitialsFontSize(size: number) {
  return size >= 32 ? mediumFontSize : size / 2
}

function getOnlineIndicatorStyle(
  hook: PersonIconHookInterface,
) {
  return hook.shouldRenderOnlineIndicator
    ? (hook.isOnline || hook.isBot) ? styles.online : styles.offline
    : {}
}

PersonIcon.defaultProps = defaultProps

export default PersonIcon
