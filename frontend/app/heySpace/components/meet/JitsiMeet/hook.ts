import {
  useEffect, useState, useCallback, useRef
} from 'react'
import { JitsiMeetInterface } from '.'
import { useSelector } from 'common/hooks/useSelector'
import {
  selectProjectName,
  selectProjectIsGroupOrDirectChat,
} from 'models/domain/ProjectsModel/selectors'
import {
  selectCurrentUserFullName,
  selectCurrentUserEmail,
  selectCurrentUserAvatarUrl
} from 'models/domain/UsersModel/selectors/domain'
import handleError from 'common/utils/handleError'
import { onMessageSend } from 'models/domain/MessagesModel/actions'
import { useDispatch } from 'react-redux'
import { i18n } from 'i18n'
import { AppEventEmitter, UserTracker } from 'common/services'
import sanitizeString from 'common/utils/sanitizeString'
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants'
import { Id } from 'common/utils/identifier'
import { AnyDict, AppEventType } from 'common/types'
import DesktopAppController from 'common/utils/desktopAppController'
import setupScreenSharingRender from './setupScreenSharingRender'
import initPopupsConfigurationRender from './initPopupsConfigurationRender'
import { onCloseModal } from 'models/component/ModalsModel/actions'
import { ModalType } from 'models/component/ModalsModel/types'

const MEET_DOMAIN = 'meet.hey.space'

type JitsiMeetHookInterface = {
  isLoading: boolean,
}

export default function useComponent(props: JitsiMeetInterface): JitsiMeetHookInterface {
  const [isLoading, onSetIsLoading] = useState(true)
  let containerName = useSelector(state => selectProjectName(state, { projectId: props.objectId }))
  const isConversation = useSelector(state => selectProjectIsGroupOrDirectChat(state, { projectId: props.objectId }))
  const api = useRef()


  if (isConversation) {
    containerName = `conversation-${props.objectId}`
  }

  const userFullName = useSelector(selectCurrentUserFullName)
  const email = useSelector(selectCurrentUserEmail)
  const avatarUrl = useSelector(selectCurrentUserAvatarUrl)

  const roomName = getRoomName(containerName, props.objectId)

  const dispatch = useDispatch()
  const onSendMessage = useCallback(
    (text) => dispatch(onMessageSend(text, props.objectId, [], [], false)),
    [dispatch, props.objectId]
  )

  const onSendVideoCallNotify = useCallback(() => {
    const link = getLink(roomName, MEET_DOMAIN)
    const message = composeMessage(userFullName, link)
    onSendMessage(message)
  },
  [userFullName, roomName, onSendMessage])

  function startConference() {
    try {
      if (!containerName || !props.objectId) {
        handleError('project name is empty!')
        return
      }
      const options = composeMeetOptions(roomName, email, userFullName, avatarUrl, onSetIsLoading)

      UserTracker.track(UserTrackerEvent.featureUsed, { name: 'HeySpace Meets' })

      // @ts-ignore
      api.current = new window.JitsiMeetExternalAPI(MEET_DOMAIN, options)

      if (DesktopAppController.isDesktopApp()) {
        // @ts-ignore
        initPopupsConfigurationRender(api.current);
        // @ts-ignore
        setupScreenSharingRender(api.current)
      }

      // @ts-ignore
      api.current.addEventListener('videoConferenceJoined', onSendVideoCallNotify)
      // @ts-ignore
      api.current.addEventListener('readyToClose', disposeMeet)
      // @ts-ignore
      api.current.addEventListener('suspendDetected', disposeMeet)
    } catch (error) {
      handleError('Failed to load Jitsi API', error)
    }
  }

  const disposeMeet = useCallback(() => {
    // @ts-ignore
    api.current.dispose()
    setTimeout(() => {
      dispatch(onCloseModal(ModalType.HEYSPACE_MEET))
    }, 100)
  }, [dispatch])

  useEffect(() => {
    // verify the JitsiMeetExternalAPI constructor is added to the global..
    if (window.JitsiMeetExternalAPI) {
      startConference()
    } else {
      handleError('Jitsi Meet API script not loaded')
    }

    AppEventEmitter.on(AppEventType.DISPOSE_MEET, disposeMeet)

    return () => {
      if (api.current) {
        // @ts-ignore
        api.current.dispose()
      }
    }
  }, [])


  return {
    isLoading,
  }
}

function getRoomName(projectName: string, objectId: Id): string {
  const sanitizedProjectName = sanitizeString(projectName)
  return `heyspace-${sanitizedProjectName?.toLowerCase().replace(/ /g, '')}-${objectId}`
}

function getLink(roomName: string, meetDomain: string): string {
  return `https://${meetDomain}/${roomName}`
}

function composeMessage(fullName: string, link: string): string {
  return i18n.t(`{{fullName}} joined video call, here is the link: {{link}}`, { fullName, link })
}

function composeMeetOptions(
  roomName: string,
  email: string,
  userFullName: string,
  avatarUrl: string,
  onSetIsLoading: (isLoading: boolean) => void,
): AnyDict {
  return {
    roomName,
    height: '100%',
    width: '100%',
    parentNode: document.getElementById('jitsi-container'),
    interfaceConfigOverwrite: {
      filmStripOnly: false,
      SHOW_JITSI_WATERMARK: false,
      TOOLBAR_BUTTONS: [
        'microphone', 'camera', 'closedcaptions', 'desktop', 'embedmeeting', 'fullscreen',
        'fodeviceselection', 'hangup', 'profile', 'chat', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
        'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
        'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone', 'security'
      ].filter(Boolean)
    },
    configOverwrite: {
      disableSimulcast: false,
      prejoinPageEnabled: true,
    },
    userInfo: {
      email,
      displayName: userFullName,
      avatarUrl,
    },
    onload: () => onSetIsLoading(false),
  }
}
