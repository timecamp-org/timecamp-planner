import React from 'react';

import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import surroundSelectionWithToken from 'common/utils/surroundSelectionWithToken';
import BaseComponent from 'commonEnhancers/BaseComponent';
import * as AppModelActions from 'models/domain/AppModel/actions';
import * as TasksActions from 'models/domain/TasksModel/actions';
import { selectTaskDescription } from 'models/domain/TasksModel/selectors';
import { selectIsTaskDescriptionDirty } from 'models/domain/TasksModel/selectors/domain';

export const tabTypes = {
  EDIT: 'edit',
  PREVIEW: 'preview',
};

function enhance(ComposedComponent) {
  class EnhanceCardDetailsDescriptionEditor extends BaseComponent {
    static propTypes = {
      taskId: PropTypes.string.isRequired,
    };

    state = {
      isDescriptionBeingEdited: false,
      selectedTab: tabTypes.EDIT,
      description: this.props.description,
    };

    constructor(props) {
      super(props);
      this.debouncedOnSetIsTaskDescriptionDirty = debounce(this.props.onSetIsTaskDescriptionDirty, 1000, {
        leading: true,
      });
    }

    render() {
      return (
        <ComposedComponent
          taskId={this.props.taskId}
          selectedTab={this.state.selectedTab}
          description={this.state.description}
          isDirty={this.props.isDirty}
          onChangeDescription={this.onChangeDescription}
          onChangeSelectedTab={this.onChangeSelectedTab}
          onSetTextareaRef={this.onSetTextareaRef}
          onSetTextareaInstanceRef={this.onSetTextareaInstanceRef}
          preventDescriptionTextareaBlur={this.preventDescriptionTextareaBlur}
          onBoldClick={this.onBoldClick}
          onItalicClick={this.onItalicClick}
          onUnderlineClick={this.onUnderlineClick}
          onStrikeClick={this.onStrikeClick}
          onCodeClick={this.onCodeClick}
          onKeyDown={this.onKeyDown}
          onSaveDescription={this.onSaveDescription}
          onCancelEdit={this.onCancelEdit}
          onSetIsTaskDescriptionDirty={this.debouncedOnSetIsTaskDescriptionDirty}
          isDescriptionBeingEdited={this.state.isDescriptionBeingEdited}
          onSetDescriptionIsBeingEdited={this.onSetDescriptionIsBeingEdited}
          onCloseCardDetailsModal={this.props.onCloseCardDetailsModal}
        />
      );
    }

    onSetTextareaRef(ref) {
      this.textareaRef = ref;
    }

    onSetTextareaInstanceRef(ref) {
      this.textareaInstanceRef = ref;
    }

    preventDescriptionTextareaBlur(event) {
      event.preventDefault();
    }

    onChangeSelectedTab(selectedTab) {
      this.setState({
        selectedTab,
      });
    }

    onChangeDescription(event) {
      this.debouncedOnSetIsTaskDescriptionDirty(event.target.value !== this.props.description);
      const description = event.target.value;
      this.setState({
        description,
      });
    }

    surroundSelectionWithToken(startToken, endToken) {
      this.debouncedOnSetIsTaskDescriptionDirty(true);
      if (!endToken) {
        endToken = startToken;
      }

      const { selectionStart, selectionEnd } = this.textareaRef;

      this.setState(
        ({ description }) => ({
          description: surroundSelectionWithToken(startToken, endToken, description, {
            start: selectionStart,
            end: selectionEnd,
          }),
        }),
        () => {
          this.textareaRef.selectionStart = selectionStart + startToken.length;
          this.textareaRef.selectionEnd = selectionEnd + endToken.length;
        }
      );
    }

    onBoldClick() {
      this.surroundSelectionWithToken('*');
    }

    onItalicClick(event) {
      this.surroundSelectionWithToken('_');
    }

    onUnderlineClick(event) {
      this.surroundSelectionWithToken('__');
    }

    onStrikeClick(event) {
      this.surroundSelectionWithToken('~');
    }

    onCodeClick() {
      const { selectionStart, selectionEnd } = this.textareaRef;

      if (selectionStart === selectionEnd) {
        this.surroundSelectionWithToken('`');
      } else {
        const selectedText = this.state.description.slice(selectionStart, selectionEnd);
        // if there's a newline char in selected text (it's a multiline text) make it codeblock otherwise make it inline code
        if (selectedText.includes('\n')) {
          this.surroundSelectionWithToken('```\n', '\n```');
        } else {
          this.surroundSelectionWithToken('`');
        }
      }
    }

    onKeyDown(event) {
      switch (event.key) {
        case 'b': {
          if (event.metaKey || event.ctrlKey) {
            this.surroundSelectionWithToken('*');
          }
          break;
        }
        case 'i': {
          if (event.metaKey || event.ctrlKey) {
            this.surroundSelectionWithToken('_');
          }
          break;
        }
        case 'u': {
          if (event.metaKey || event.ctrlKey) {
            this.surroundSelectionWithToken('__');
          }
          break;
        }
        case 'x': {
          if ((event.metaKey || event.ctrlKey) && event.shiftKey) {
            this.surroundSelectionWithToken('~');
          }
          break;
        }
        default: {
          break;
        }
      }
    }

    onSaveDescription(event) {
      event.stopPropagation();
      this.props.onTaskUpdate(this.props.taskId, {
        description: this.state.description,
      });
      this.props.onSetIsTaskDescriptionDirty(false);
      this.setState({
        isDescriptionBeingEdited: false,
      });
    }

    onSetDescriptionIsBeingEdited() {
      if (!this.state.isDescriptionBeingEdited) {
        this.setState(
          {
            isDescriptionBeingEdited: true,
            selectedTab: tabTypes.EDIT,
          },
          () => {
            if (this.textareaRef) {
              this.textareaRef.focus();
            }
          }
        );
      }
    }

    onCancelEdit(event) {
      if (event) {
        event.stopPropagation();
      }
      this.props.onSetIsTaskDescriptionDirty(false);
      this.setState({
        description: this.props.description,
        isDescriptionBeingEdited: false,
      });
    }

    componentDidMount() {
      if (this.textareaInstanceRef) {
        this.resizeOnMountTimeout = setTimeout(() => this.textareaInstanceRef._resizeComponent(), 0);
      }
    }

    componentWillUnmount() {
      if (this.resizeOnMountTimeout) {
        clearTimeout(this.resizeOnMountTimeout);
      }
    }

    componentDidUpdate(prevProps, prevState) {
      if (prevProps.taskId !== this.props.taskId) {
        this.onCancelEdit(null);
      } else if (!this.state.isDescriptionBeingEdited && prevProps.description !== this.props.description) {
        this.setState({
          description: this.props.description,
        });
      }
    }
  }

  const mapStateToProps = (state, props) => ({
    description: selectTaskDescription(state, { taskId: props.taskId }),
    isDirty: selectIsTaskDescriptionDirty(state),
  });

  const mapDispatchToProps = (dispatch, props) => ({
    onCloseCardDetailsModal: () => dispatch(AppModelActions.onSetOpenedCardDetailsModalId(null)),
    onTaskUpdate: (taskId, taskFields) => dispatch(TasksActions.onTaskUpdate(taskId, taskFields, true)),
    onSetIsTaskDescriptionDirty: (isDirty) => dispatch(TasksActions.onSetIsTaskDescriptionDirty(isDirty)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceCardDetailsDescriptionEditor);
}

export default enhance;
