import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import { selectProjectIdByConversationId } from 'models/domain/ProjectsModel/selectors'
import { selectProjectPeople } from 'models/domain/ProjectsModel/selectors/domain'
import {
  selectCurrentUserId,
  selectUsersAvatarUrl,
} from 'models/domain/UsersModel/selectors/domain'
import {
  selectUsersInitials,
} from 'models/domain/UsersModel/selectors'
import { List } from 'immutable'
import fixGravatarAvatarUrl from 'common/utils/fixGravatarAvatarUrl'

function enhance(ComposedComponent) {
  class EnhanceGroupConversationIcon extends BaseComponent {

    static propTypes = {
      conversationId: PropTypes.string.isRequired,
    }

    render() {
      const data = this.getData()
      const [firstUser, secondUser, thirdUser] = [data.get(0), data.get(1), data.get(2)]
      return (
        <ComposedComponent
          size={this.props.size}
          firstUser={firstUser}
          secondUser={secondUser}
          thirdUser={thirdUser}
        />
      )
    }

    getData() {
      const { people, usersAvatarUrl, usersInitials, currentUserId } = this.props
      let result = new List()
      const size = Math.min(3, people.size)

      for (let i = 0; i < size; i++) {
        const userId = people.get(i)
        const rawAvatarUrl = usersAvatarUrl.get(userId)
        const avatarUrl = rawAvatarUrl
          ? fixGravatarAvatarUrl(rawAvatarUrl)
          : ''
        const initials = usersInitials.get(userId)
        result = result.push({ avatarUrl, initials, id: userId })
      }

      result = result.sort((a, b) => {
        if (a.avatarUrl && a.id !== currentUserId) {
          return -1
        } else if (b.avatarUrl && b.id !== currentUserId) {
          return 1
        } else if (a.id === currentUserId) {
          return 1
        } else if (b.id === currentUserId) {
          return -1
        } else {
          return 0
        }
      })

      return result
    }


  }

  const mapStateToProps = (state, props) => {
    const projectId = selectProjectIdByConversationId(state, { conversationId: props.conversationId })
    return {
      currentUserId: selectCurrentUserId(state),
      people: selectProjectPeople(state, { projectId: projectId }),
      usersInitials: selectUsersInitials(state),
      usersAvatarUrl: selectUsersAvatarUrl(state),
    }
  }


  return connect(mapStateToProps)(EnhanceGroupConversationIcon)
}

export default enhance
