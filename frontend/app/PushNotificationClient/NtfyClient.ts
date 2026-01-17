import { PushNotificationClientInterface } from './PushNotificationClientInterface'
import {
  PushNotificationClientOptions,
  PushNotificationMessage,
  TokenRefreshListener,
} from './types'
import { LoggerInterface } from '../common/interfaces/LoggerInterface'
import { DeviceType } from '../common/models/domain/NotificationsModel/types'
import { Maybe } from '../common/types'
import { getPushNotificationFromRawMessage } from './utils'

type NtfyEventPayload = {
  event?: string
  message?: string
  title?: string
  topic?: string
}

const defaultOptions = {
  onNotificationOpened: console.log,
  onTokenRefresh: console.log,
  canShowForegroundNotification: () => true,
  icon: '../../commonAssets/favicon.png',
  topicPrefix: 'heyspace-',
}

const DEVICE_ID_STORAGE_KEY = 'deviceId'

export default class NtfyClient implements PushNotificationClientInterface {
  private options: PushNotificationClientOptions
  private logger: LoggerInterface
  private eventSource: EventSource | null
  private tokenRefreshListeners: TokenRefreshListener[]
  private currentTopic: string | null

  constructor(config: PushNotificationClientOptions, logger: LoggerInterface = console) {
    this.options = { ...defaultOptions, ...config }
    this.logger = logger
    this.eventSource = null
    this.tokenRefreshListeners = []
    this.currentTopic = null
  }

  init = async (): Promise<void> => {
    const existingTopic = this.getStoredDeviceId()
    if (existingTopic) {
      this.subscribeToTopic(existingTopic)
    }
  }

  onTokenRefresh = (listener: TokenRefreshListener = this.options.onTokenRefresh): void => {
    this.tokenRefreshListeners.push(listener)
    if (this.currentTopic) {
      listener(this.currentTopic)
    }
  }

  subscribeBackgroundNotificationClick = (): (() => PromiseLike<void>) => () => Promise.resolve()

  getDeviceInfo = async (): Promise<Maybe<{ deviceId: string; deviceType: DeviceType }>> => {
    if (!this.options.baseUrl) {
      return null
    }

    const permission = await this.ensureNotificationPermission()
    if (!permission) {
      return null
    }

    const topic = this.getOrCreateTopic()
    this.subscribeToTopic(topic)
    this.notifyTokenRefresh(topic)

    return {
      deviceId: topic,
      deviceType: DeviceType.BROWSER,
    }
  }

  requestPermission = async (): Promise<void> => {
    await this.ensureNotificationPermission()
  }

  private ensureNotificationPermission = async (): Promise<boolean> => {
    if (typeof Notification === 'undefined') {
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission === 'denied') {
      return false
    }

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  private subscribeToTopic = (topic: string): void => {
    if (!topic || !this.options.baseUrl) {
      return
    }

    if (this.currentTopic === topic && this.eventSource) {
      return
    }

    this.currentTopic = topic
    this.closeEventSource()
    const sseUrl = this.buildSseUrl(topic)
    this.eventSource = new EventSource(sseUrl)
    this.eventSource.onmessage = (event) => this.handleMessageEvent(event)
    this.eventSource.onerror = (error) => {
      this.logger.warn(error)
    }
  }

  private handleMessageEvent = (event: MessageEvent): void => {
    try {
      const payload = JSON.parse(event.data) as NtfyEventPayload
      if (payload.event && payload.event !== 'message') {
        return
      }

      const notificationMessage = this.parseNtfyMessage(payload)
      if (!notificationMessage) {
        return
      }

      const notification = getPushNotificationFromRawMessage(notificationMessage)
      if (!notification) {
        return
      }

      if (!this.options.canShowForegroundNotification(notification)) {
        return
      }

      if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
        return
      }

      const nativeNotification = new Notification(notification.title, {
        body: notification.body,
        icon: this.options.icon,
        data: notification,
      })

      nativeNotification.onclick = () => {
        this.options.onNotificationOpened(notification)
      }
    } catch (error) {
      this.logger.error(error)
    }
  }

  private parseNtfyMessage = (payload: NtfyEventPayload): PushNotificationMessage | null => {
    if (!payload.message) {
      return null
    }

    try {
      const parsed = JSON.parse(payload.message) as PushNotificationMessage
      return {
        ...parsed,
        title: parsed.title || payload.title,
        topic: parsed.topic || payload.topic,
      }
    } catch (error) {
      this.logger.warn(error)
      return null
    }
  }

  private buildSseUrl = (topic: string): string => {
    const baseUrl = this.options.baseUrl.endsWith('/') ? this.options.baseUrl.slice(0, -1) : this.options.baseUrl
    return `${baseUrl}/${topic}/sse`
  }

  private getOrCreateTopic = (): string => {
    const existing = this.getStoredDeviceId()
    if (existing) {
      return existing
    }
    const newTopic = `${this.options.topicPrefix || ''}${this.generateTopicId()}`
    this.setStoredDeviceId(newTopic)
    return newTopic
  }

  private generateTopicId = (): string => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID()
    }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  }

  private getStoredDeviceId = (): string | null => {
    try {
      return window.localStorage?.getItem(DEVICE_ID_STORAGE_KEY)
    } catch (error) {
      return null
    }
  }

  private setStoredDeviceId = (deviceId: string): void => {
    try {
      window.localStorage?.setItem(DEVICE_ID_STORAGE_KEY, deviceId)
    } catch (error) {
      this.logger.warn(error)
    }
  }

  private notifyTokenRefresh = (deviceId: string): void => {
    this.tokenRefreshListeners.forEach((listener) => listener(deviceId))
  }

  private closeEventSource = (): void => {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }
  }
}
