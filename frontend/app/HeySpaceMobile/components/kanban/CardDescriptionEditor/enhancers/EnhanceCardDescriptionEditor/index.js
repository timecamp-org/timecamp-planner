import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import RouteName from '../../../../AppNavigation/routeNames'
import {
  selectProjectIdByTaskId, selectTaskColor, selectTaskDescription,
} from 'models/domain/TasksModel/selectors'
import {
  selectIsTaskDescriptionDirty,
} from 'models/domain/TasksModel/selectors/domain'
import * as TasksActions from 'models/domain/TasksModel/actions'
import surroundSelectionWithToken from 'common/utils/surroundSelectionWithToken'
import isIOS from '../../../../../utils/isIOS'
import { NavigationService } from 'common/services'
import { withMappedNavigationParams } from 'react-navigation-props-mapper'
import calculateSelection from './calculateSelection'

export const tabTypes = {
  EDIT: 'edit',
  PREVIEW: 'preview',
}

// don't ask me why I need this here, take a look at https://github.com/akalin-keybase/rn-text-input-bugs/blob/master/App.js
const isAndroid = !isIOS

function enhance(ComposedComponent) {
  class EnhanceCardDescriptionEditor extends BaseComponent {

    static propTypes = {
      taskId: PropTypes.string.isRequired,
    }

    state = {
      androidWaitingForNextSelectionChange: isAndroid,
      isIOSWaitingForNextSelectionChange: false,
      selectedTab: tabTypes.EDIT,
      description: this.props.description || '',
      selection: {
        start: this.props.description.length,
        end: this.props.description.length,
      },
      lastUsedStartToken: null,
      lastUsedEndToken: null,
    }

    render() {
      // Again: don't ask me WHY, take a look here: https://github.com/akalin-keybase/rn-text-input-bugs/blob/master/App.js
      let { selection } = this.state
      if (isAndroid && this.state.androidWaitingForNextSelectionChange) {
        selection = undefined
      }
      return (
        <ComposedComponent
          description={this.state.description}
          selectedTab={this.state.selectedTab}
          selection={selection}
          taskColor={this.props.taskColor}

          onChangeTab={this.onChangeTab}
          onChangeDescription={this.onChangeDescription}
          onChangeSelection={this.onChangeSelection}
          onSaveDescription={this.onSaveDescription}
          onCancelEditingDescription={this.onCancelEditingDescription}

          // toolbar
          onPressBold={this.onPressBold}
          onPressItalic={this.onPressItalic}
          onPressUnderline={this.onPressUnderline}
          onPressStrike={this.onPressStrike}
          onPressCode={this.onPressCode}
        />
      )
    }

    onChangeTab(selectedTab) {
      const newState = {
        selectedTab,
      }
      if (selectedTab === tabTypes.PREVIEW) {
        newState.selection = {
          start: this.state.description.length,
          end: this.state.description.length,
        }
        newState.androidWaitingForNextSelectionChange = isAndroid
      }

      this.setState(newState)
    }

    onChangeSelection(event) {
      if (isAndroid) {
        if (this.state.androidWaitingForNextSelectionChange) {
          this.setState({
            androidWaitingForNextSelectionChange: false,
          })
        } else {
          const { selection } = event.nativeEvent
          this.setState({
            selection,
          })
        }
      } else {
        if (this.state.isIOSWaitingForNextSelectionChange) {
          this.setState({
            isIOSWaitingForNextSelectionChange: false,
          })
        } else {
          const { selection } = event.nativeEvent
          this.setState({
            selection,
          })
        }
      }
    }

    onChangeDescription(description) {
      let { selection } = this.state

      // Fix jumping cursor on android.
      // If something goes wrong with the description editor start looking for bugs here,
      // react-native guys like to change TextInput's behaviour from time to time ;x
      if (isAndroid) {
        selection = calculateSelection(description, this.state.description, selection)
      }

      this.setState({
        description,
        selection,
        androidWaitingForNextSelectionChange: isAndroid,
      }, () => {
        this.props.onSetIsTaskDescriptionDirty(true)
      })
    }

    onCloseDescriptionEditor() {
      this.props.onSetIsTaskDescriptionDirty(false)
      NavigationService.navigate(RouteName.CARD_DETAILS, {
        projectId: this.props.projectId,
        taskId: this.props.taskId,
      })
    }

    onSaveDescription() {
      const { description } = this.state
      this.props.onTaskUpdate({
        description,
      })
      this.onCloseDescriptionEditor()
    }

    onCancelEditingDescription() {
      this.onCloseDescriptionEditor()
    }

    surroundSelectionWithToken(startToken, endToken) {
      this.props.onSetIsTaskDescriptionDirty(true)
      if (!endToken) {
        endToken = startToken
      }

      this.setState(({ description, selection }) => {
        const selectionStart = selection.start + startToken.length
        const selectionEnd = selection.end + endToken.length

        return {
          description: surroundSelectionWithToken(startToken, endToken, description, selection),
          androidWaitingForNextSelectionChange: isAndroid,
          isIOSWaitingForNextSelectionChange: isIOS,
          selection: {
            start: selectionStart,
            end: selectionEnd,
          },
        }
      })
    }

    onPressBold(event) {
      this.surroundSelectionWithToken('*')
    }

    onPressItalic() {
      this.surroundSelectionWithToken('_')
    }

    onPressUnderline() {
      this.surroundSelectionWithToken('__')
    }

    onPressStrike() {
      this.surroundSelectionWithToken('~')
    }

    onPressCode() {
      const { start: selectionStart, end: selectionEnd } = this.state.selection

      if (selectionStart === selectionEnd) {
        this.surroundSelectionWithToken('`')
      } else {
        const selectedText = this.state.description.slice(selectionStart, selectionEnd)
        // if there's a newline char in selected text (it's a multiline text) make it codeblock otherwise make it inline code
        if (selectedText.includes('\n')) {
          this.surroundSelectionWithToken('```\n', '\n```')
        } else {
          this.surroundSelectionWithToken('`')
        }
      }
    }

  }

  const mapStateToProps = (state, props) => ({
    taskColor: selectTaskColor(state, { taskId: props.taskId }),
    description: selectTaskDescription(state, { taskId: props.taskId }),
    projectId: selectProjectIdByTaskId(state, { taskId: props.taskId }),
    isDirty: selectIsTaskDescriptionDirty(state),
  })


  const mapDispatchToProps = (dispatch, props) => ({
    onTaskUpdate: (taskFields) => dispatch(TasksActions.onTaskUpdate(props.taskId, taskFields, true)),
    onSetIsTaskDescriptionDirty: (isDirty) => dispatch(TasksActions.onSetIsTaskDescriptionDirty(isDirty)),
  })

  return withMappedNavigationParams()(connect(mapStateToProps, mapDispatchToProps)(EnhanceCardDescriptionEditor))
}

export default enhance
