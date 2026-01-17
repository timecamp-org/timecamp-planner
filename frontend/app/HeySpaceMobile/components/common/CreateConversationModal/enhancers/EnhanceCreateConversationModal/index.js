import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { List, is } from 'immutable'
import fuzzysearch from 'fuzzysearch'
import BaseComponent from 'BaseComponent'
import { generateConversationId } from 'common/utils/generateCombinedId'

import { selectCurrentUserId, selectUsersSearchName } from 'models/domain/UsersModel/selectors/domain'
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain'
import {
  onCreateConversationIfDoesNotExist,
  onProjectCreate,
  onSetIsConversationVisible,
} from 'models/domain/ProjectsModel/actions'
import { selectConversationsPeople } from 'models/domain/ProjectsModel/selectors'
import RouteName from '../../../../AppNavigation/routeNames'
import { NavigationService } from 'common/services'

const emptyList = new List()

function enhance(ComposedComponent) {
  class EnhanceCreateConversationModal extends BaseComponent {

    static propTypes = {
      userSearchNames: ImmutablePropTypes.map.isRequired,
    }

    state = {
      searchPhrase: '',
      selectedUserIds: emptyList,
    }

    render() {
      return (
        <ComposedComponent
          isVisible={this.props.isVisible}
          searchPhrase={this.state.searchPhrase}
          filteredUserIds={this.filterUserNames()}
          selectedUserIds={this.state.selectedUserIds}
          onClose={this.props.onClose}
          onModalHide={this.onSetInitialState}
          onChangeSearchPhrase={this.onChangeSearchPhrase}
          onAddUserToSelected={this.onAddUserToSelected}
          onRemoveUserFromSelected={this.onRemoveUserFromSelected}
          onPressUserListItem={this.onPressUserListItem}
          onBackButtonPress={this.onBackButtonPress}
          onGoToConversation={this.onGoToConversation}
          setSearchInputRef={this.setSearchInputRef}
          blurSearchInput={this.blurSearchInput}
        />
      )
    }

    setSearchInputRef(ref) {
      this.searchInputRef = ref
    }

    blurSearchInput() {
      if (this.searchInputRef) {
        this.searchInputRef.blur()
      }
    }

    onChangeSearchPhrase(text) {
      this.setState({
        searchPhrase: text,
      })
    }

    navigateToConversation(conversationId) {
      this.props.onClose()
      NavigationService.onCloseDrawer()
      NavigationService.navigate(RouteName.CONVERSATION, { conversationId })
    }

    findExistingConversationIdForPeople(people) {
      let existingConversationId = null

      this.props.conversationsPeople
        .find((conversationPeople, conversationId) => {
          const peopleEqual = is(people, conversationPeople.sort())
          if (peopleEqual) {
            existingConversationId = conversationId
            return true
          } else {
            return false
          }
        })

      return existingConversationId
    }

    onGoToConversation() {
      if (this.state.selectedUserIds.size > 0) {
        const { currentUserId } = this.props
        let { selectedUserIds } = this.state
        selectedUserIds = selectedUserIds.filterNot(selectedUserId => selectedUserId === currentUserId)
        if (selectedUserIds.size === 0) {
          this.onNavigateToUserOwnConversation()
        } else if (selectedUserIds.size === 1) {
          this.onNavigateToOneToOneConversation(selectedUserIds.first())
        } else {
          const people = selectedUserIds.push(this.props.currentUserId).sort()
          this.onGoToGroupConversation(people)
        }
      }
    }

    onNavigateToOneToOneConversation(userId) {
      const { organizationId, currentUserId } = this.props
      const people = new List([currentUserId, userId])
      const conversationId = generateConversationId(people, organizationId)

      this.props.onCreateConversationIfDoesNotExist(people)
      this.navigateToConversation(conversationId)
    }

    onGoToGroupConversation(people) {
      const { organizationId, currentUserId } = this.props
      if (!people.includes(currentUserId)) {
        people = people.push(currentUserId)
      }

      const conversationId = generateConversationId(people, organizationId)
      this.props.onCreateConversationIfDoesNotExist(people)

      this.navigateToConversation(conversationId)
    }

    onNavigateToUserOwnConversation() {
      const { organizationId, currentUserId } = this.props
      const people = new List([currentUserId])
      const conversationId = generateConversationId(people, organizationId)
      this.props.onCreateConversationIfDoesNotExist(people)
      this.navigateToConversation(conversationId)
    }

    onPressUserListItem(userId) {
      if (this.state.selectedUserIds.includes(userId)) {
        this.onRemoveUserFromSelected(userId)
      } else {
        this.onAddUserToSelected(userId)
      }
    }

    onAddUserToSelected(userId) {
      this.setState(prevState => ({
        selectedUserIds: prevState.selectedUserIds.push(userId),
      }))
    }

    onRemoveUserFromSelected(userIdToRemove) {
      this.setState(prevState => ({
        selectedUserIds: prevState.selectedUserIds.filterNot(userId => userId === userIdToRemove),
      }))
    }

    filterUserNames() {
      const { searchPhrase } = this.state
      const { userSearchNames } = this.props

      if (searchPhrase === '') {
        return userSearchNames.keySeq().toList()
      }

      let result = emptyList
      userSearchNames.forEach((userSearchValue, userId) => {
        if (fuzzysearch(searchPhrase.toLowerCase(), userSearchValue.toLowerCase())) {
          result = result.push(userId)
        }
      })

      return result.sort(this.createNameComparatorForPhrase(searchPhrase))
    }

    createNameComparatorForPhrase(searchPhrase) {
      return (userAId, userBId) => {
        const compareValueA = this.props.userSearchNames.get(userAId) ? this.props.userSearchNames.get(userAId).toLowerCase().trim() : ''
        const compareValueB = this.props.userSearchNames.get(userBId) ? this.props.userSearchNames.get(userBId).toLowerCase().trim() : ''
        let positionA = compareValueA.indexOf(searchPhrase)
        let positionB = compareValueB.indexOf(searchPhrase)
        if (positionA < 0) {
          positionA = Number.MAX_SAFE_INTEGER
        }
        if (positionB < 0) {
          positionB = Number.MAX_SAFE_INTEGER
        }
        return (positionA === positionB)
          ? 0
          : (positionA < positionB ? -1 : 1)
      }
    }

    onSetInitialState() {
      this.setState({
        searchPhrase: '',
        selectedUserIds: emptyList,
      })
    }

    onBackButtonPress() {
      this.props.onClose()
    }

  }

  const mapStateToProps = (state, props) => ({
    userSearchNames: selectUsersSearchName(state),
    currentUserId: selectCurrentUserId(state),
    conversationsPeople: selectConversationsPeople(state),
    organizationId: selectCurrentOrganizationId(state),
  })

  const mapDispatchToProps = (dispatch, props) => ({
    onProjectCreate: (id, people) => dispatch(onProjectCreate({
      id,
      isPrivate: true,
    }, people, true)),
    onSetIsConversationVisible: (conversationId, isVisible) => dispatch(onSetIsConversationVisible(conversationId, isVisible)),
    onCreateConversationIfDoesNotExist: (people) => dispatch(onCreateConversationIfDoesNotExist(people)),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceCreateConversationModal)
}

export default enhance
