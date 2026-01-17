import React from 'react'
import { useComponent } from 'commonComponents/UserName/hook'

export type UserNameInterface = {
  className?: string,
  firstNameClassName?: string,
  lastNameClassName?: string,

  shouldRenderFirstName?: boolean,
  shouldRenderLastName?: boolean,

  userId: string,
}

const defaultProps = {
  className: '',
  firstNameClassName: '',
  lastNameClassName: '',

  shouldRenderFirstName: true,
  shouldRenderLastName: true,
}

export const UserName: React.FC<UserNameInterface> = (props: UserNameInterface) => {
  const { firstName, lastName } = useComponent(props)

  if (firstName && lastName) {
    return (
      <div className={props.className}>
        {props.shouldRenderFirstName && firstName
          ? <span className={props.firstNameClassName}>{`${firstName} `}</span>
          : null
        }
        {props.shouldRenderLastName && lastName
          ? <span className={props.lastNameClassName}>{lastName}</span>
          : null
        }
      </div>
    )
  } else {
    return null
  }
}

UserName.defaultProps = defaultProps

export default UserName
