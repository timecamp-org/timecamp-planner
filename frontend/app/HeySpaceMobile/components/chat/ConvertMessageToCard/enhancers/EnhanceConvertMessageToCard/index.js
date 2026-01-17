import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withMappedNavigationParams } from 'react-navigation-props-mapper'
import { List } from 'immutable'

import BaseComponent from 'BaseComponent'
import { onConvertConversationMessageToTask } from 'models/domain/MessagesModel/actions'
import { onFetchProjectListsData } from 'models/domain/RequestModel/actions'
import { selectProjectNames } from 'models/domain/ProjectsModel/selectors/domain'
import { selectParsedMessageText } from 'models/domain/MessagesModel/selectors'
import { selectSortedAvailableVisibleSpacesIds } from 'models/domain/ProjectsModel/selectors/sortedAvailableVisibleSpacesIdsSelector'
import {
  selectProjectsListIds,
} from 'models/domain/ListsModel/selectors'
import {
  selectListNames,
  selectListIsArchivedStatuses,
} from 'models/domain/ListsModel/selectors/domain'
import { NavigationService } from 'common/services'

function enhance(ComposedComponent) {
  class EnhanceConvertMessageToCard extends BaseComponent {

    static propTypes = {
      projectId: PropTypes.string.isRequired,
      messageId: PropTypes.string.isRequired,
    }

    constructor(props) {
      super(props)

      const spaceId = this.props.projectId || this.props.spaceIds.first()
      props.onFetchProjectListsData(spaceId)

      this.state = {
        selectedSpaceId: spaceId,
        selectedListId: this.getListIds(spaceId).first(),
        listIds: this.props.spacesSections.get(spaceId),
        cardName: this.props.messageText,
      }
    }


    render() {
      return (
        <ComposedComponent
          spaceIds={this.props.spaceIds}
          listIds={this.getListIds(this.state.selectedSpaceId)}
          selectedSpaceId={this.state.selectedSpaceId}
          selectedListId={this.state.selectedListId}
          cardName={this.state.cardName}

          getSpaceLabel={this.getSpaceLabel}
          getListLabel={this.getListLabel}
          onSelectSpaceId={this.onSelectSpaceId}
          onSelectListId={this.onSelectListId}
          onChangeCardName={this.onChangeCardName}
          onConvertMessageToCard={this.onConvertMessageToCard}
          onCancelConvertMessageToCard={this.onCloseConvertMessageToCard}
        />
      )
    }

    getListIds(selectedSpaceId, spacesSections = this.props.spacesSections) {
      const spaceListIds = spacesSections.get(selectedSpaceId)

      if (spaceListIds) {
        return spaceListIds
          .filter(listId => this.props.listsIsArchivedStatuses.get(listId) === false)
      } else {
        return new List().push(null)
      }
    }

    onConvertMessageToCard() {
      const spaceId = this.state.selectedSpaceId
      const listId = this.state.selectedListId
      const { cardName } = this.state
      const { messageId } = this.props
      this.props.onConvertConversationMessageToTask({
        spaceId,
        listId,
        messageId,
        cardName,
      })
      this.onCloseConvertMessageToCard()
    }

    onCloseConvertMessageToCard() {
      NavigationService.pop()
    }

    onChangeCardName(text) {
      this.setState({ cardName: text })
    }

    onSelectSpaceId(selectedSpaceId) {
      this.props.onFetchProjectListsData(selectedSpaceId)
      this.setState({
        selectedSpaceId,
        selectedListId: this.getListIds(selectedSpaceId).first(),
      })
    }

    onSelectListId(selectedListId) {
      this.setState({
        selectedListId,
      })
    }

    getSpaceLabel(spaceId) {
      return this.props.spaceNames.get(spaceId) || ''
    }

    getListLabel(listId) {
      return this.props.listNames.get(listId) || ''
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
      const prevFirstListId = this.getListIds(this.state.selectedSpaceId, prevProps.spacesSections).first()
      const currFirstListId = this.getListIds(this.state.selectedSpaceId, this.props
        .spacesSections).first()

      if (!prevFirstListId && prevFirstListId !== currFirstListId) {
        this.setState({
          selectedListId: currFirstListId,
        })
      }
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      spaceIds: selectSortedAvailableVisibleSpacesIds(state),
      spaceNames: selectProjectNames(state),
      spacesSections: selectProjectsListIds(state),
      listNames: selectListNames(state),
      listsIsArchivedStatuses: selectListIsArchivedStatuses(state),
      messageText: selectParsedMessageText(state, { messageId: props.messageId }),
    }
  }


  const mapDispatchToProps = (dispatch, props) => ({
    onConvertConversationMessageToTask: (data) => dispatch(onConvertConversationMessageToTask(data)),
    onFetchProjectListsData: (projectId) => dispatch(onFetchProjectListsData(projectId)),
  })

  return withMappedNavigationParams()(connect(mapStateToProps, mapDispatchToProps)(EnhanceConvertMessageToCard))
}

export default enhance
