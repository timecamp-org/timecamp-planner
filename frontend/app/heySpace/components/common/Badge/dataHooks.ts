import { RefObject } from 'react'
import { BadgeInterface } from './index'
import { BadgeNotificationType } from './types'

export type DataProviderHookInterface = {
  counter: number,
  color?: string,
  isBiggerThanZero?: boolean,
  innerRef?: RefObject<HTMLDivElement>
}

export type DataHooksInterface = {
  useDataProvider: (props: BadgeInterface) => DataProviderHookInterface
}

export const getDataHookByObjectContainer = (props: BadgeInterface): DataHooksInterface => {
  switch (props.objectType) {
    case BadgeNotificationType.TASK: {
      const { useDataProvider } = require('./unreadNotificationsCounterHooks')
      return {
        useDataProvider
      }
    }
    case BadgeNotificationType.WORKSPACE: {
      const { useDataProvider } = require('./workspaceUnreadNotificationsAndMessagesCounterHooks')
      return {
        useDataProvider
      }
    }
    case BadgeNotificationType.PROJECT: {
      const { useDataProvider } = require('./projectUnreadNotificationsCounterHooks')
      return {
        useDataProvider
      }
    }
    case BadgeNotificationType.PROJECT_GROUP: {
      const { useDataProvider } = require('./projectGroupUnreadNotificationsCounterHooks')
      return {
        useDataProvider
      }
    }
    case BadgeNotificationType.CONVERSATION: {
      const { useDataProvider } = require('./conversationUnreadNotificationsCounterHooks')
      return {
        useDataProvider
      }
    }
    case BadgeNotificationType.STANDALONE: {
      const { useDataProvider } = require('./standaloneHooks')
      return {
        useDataProvider
      }
    }
    default: {
      throw new Error(`Unsupported BadgeNotificationType: ${props.objectType}`)
    }
  }
}
