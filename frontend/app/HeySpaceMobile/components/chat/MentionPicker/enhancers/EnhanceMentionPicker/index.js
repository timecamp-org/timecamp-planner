import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import fuzzysearch from 'fuzzysearch'
import { List } from 'immutable'

import BaseComponent from 'BaseComponent'

import { getFilteredMentionSuggestion, createMentionComparatorForPhrase } from 'models/domain/MessagesModel/utils'
import { MentionType } from 'models/domain/MessagesModel/types'
import { selectEntityType } from 'models/domain/EntityModel/selectors'
import { EntityType } from 'models/domain/EntityModel/types'
import { selectProjectIdByTaskId } from 'models/domain/TasksModel/selectors'
import { selectUsersProjectMentionData } from 'models/domain/UsersModel/selectors'

const hails = [MentionType.HERE, MentionType.CHANNEL, MentionType.SPACE]
const emptyList = new List()

function Enhance(ComposedComponent) {
  class EnhanceMentionPicker extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      objectId: PropTypes.string.isRequired,
      searchValue: PropTypes.string.isRequired,
      onMentionUser: PropTypes.func.isRequired,
      onHail: PropTypes.func.isRequired,
    }

    static defaultProps = {
      searchValue: '',
    }

    render() {
      return (
        <ComposedComponent
          isVisible={this.props.isVisible}

          userIds={this.getUserIds()}
          hails={this.getHails()}

          onUserRowClick={this.props.onMentionUser}
          onHailRowClick={this.props.onHail}
        />
      )
    }

    getUserIds() {
      const { searchValue } = this.props

      const searchPhrase = searchValue.toLowerCase()
      const filteredMentionSuggestions = getFilteredMentionSuggestion(searchPhrase, this.props.mentionSuggestions)
      return filteredMentionSuggestions
        .sort(createMentionComparatorForPhrase(searchPhrase))
        .map(mentionSuggestion => mentionSuggestion.userId)
    }

    getHails() {
      let result = emptyList
      const value = this.props.searchValue.toLowerCase()

      hails.forEach(hail => {
        if (fuzzysearch(value, hail)) {
          result = result.push(hail)
        }
      })

      return result
    }

  }

  function mapStateToProps(state, props) {
    const objectType = selectEntityType(state, { entityId: props.objectId })
    const projectId = objectType === EntityType.TASK_DATA ? selectProjectIdByTaskId(state, { taskId: props.objectId }) : props.objectId
    return {
      mentionSuggestions: selectUsersProjectMentionData(state, { projectId }),
    }
  }

  return connect(mapStateToProps)(EnhanceMentionPicker)
}

export default Enhance
