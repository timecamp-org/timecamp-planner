import React, { Fragment, FC } from 'react'
import styles from './styles.css'
import PersonIcon from '../../person/PersonIcon'
import useComponent, { AvatarDescriptor } from './hook'
import { Id } from 'common/utils/identifier'

export type ProjectIconInterface = {
  projectId: Id,
  className?: string,
  personIconClassName?: string,
}

const ProjectIcon: FC<ProjectIconInterface> = (props) => {
  const hook = useComponent(props.projectId)
  const firstUser = hook.avatarDescriptors.first()

  function renderGroupConversationIcon() {
    return (
      <div className={props.className ? props.className : styles.Component}>
        <div className={styles.leftAvatar}>
          {
            firstUser ? renderIcon(firstUser) : null
          }
        </div>
        <div className={styles.rightAvatars}>
          <RightAvatars
            topUser={hook.avatarDescriptors.get(1)}
            bottomUser={hook.avatarDescriptors.get(2)}
          />
        </div>
      </div >
    )
  }

  return hook.isOneToOneConversation
    ? <PersonIcon
      className={props.personIconClassName ? props.personIconClassName : styles.personIcon}
      userId={firstUser.userId}
    />
    : renderGroupConversationIcon()
}

function RightAvatars({ topUser, bottomUser }: { topUser: AvatarDescriptor, bottomUser: AvatarDescriptor }) {
  return (
    <Fragment>
      <div className={`${styles.rightAvatar} ${!bottomUser ? styles.rightAvatarFull : undefined}`}>
        {
          topUser ? renderIcon(topUser) : null
        }
      </div>
      {bottomUser
        ? <Fragment>
          <div className={styles.separator} />
          <div className={styles.rightAvatar}>
            {
              renderIcon(bottomUser)
            }
          </div>
        </Fragment>
        : null
      }
    </Fragment>
  )
}

function renderIcon({ avatarUrl, initials }: AvatarDescriptor) {
  return avatarUrl ? renderAvatar(avatarUrl) : renderInitials(initials)
}

function renderAvatar(url: string) {
  return (
    <img
      role="presentation"
      className={styles.avatar}
      src={url}
    />
  )
}

function renderInitials(initials: string) {
  return (
    <span className={styles.initials}>{initials}</span>
  )
}

export default ProjectIcon
