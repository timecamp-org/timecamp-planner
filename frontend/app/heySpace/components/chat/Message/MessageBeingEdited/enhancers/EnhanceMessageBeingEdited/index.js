import React from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import scrollIntoViewIfNeeded from "scroll-into-view-if-needed";
import { doNothing } from "common/utils";

import TextToQuillOpsConverter from "models/domain/MessagesModel/TextToQuillOpsConverter";
import {
  selectMessageUser,
  selectMessageCreatedAt,
  selectMessageText,
} from "models/domain/MessagesModel/selectors/domain";
import * as MessagesModelActions from "models/domain/MessagesModel/actions";
import { selectUsersNicknames } from "models/domain/UsersModel/selectors/domain";

import BaseComponent from "commonEnhancers/BaseComponent";
import { Quill } from "react-quill";

const Delta = Quill.import("delta");

function Enhance(ComposedComponent) {
  class EnhanceMessageBeingEdited extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      color: PropTypes.string,
      messageId: PropTypes.string.isRequired,
      focusNewMessageEditor: PropTypes.func,

      // this enhancer:
      userNicknamesByIds: ImmutablePropTypes.map.isRequired,

      onMessageEdit: PropTypes.func.isRequired,
      setIsMessageBeingEdited: PropTypes.func.isRequired,
      updateMessageNewText: PropTypes.func.isRequired,
      onCloseMessageEdit: PropTypes.func,
    };

    static defaultProps = {
      focusNewMessageEditor: doNothing,
      onCloseMessageEdit: doNothing,
    };

    constructor(props) {
      super(props);

      this.textToQuillOpsConverter = new TextToQuillOpsConverter(
        props.userNicknamesByIds
      );
      const messageText = props.text;
      const ops =
        (messageText && messageText.ops) ||
        this.textToQuillOpsConverter.getOpsFromText(messageText);
      const messageContent = new Delta(ops);
      this.state = {
        messageContent,
        selectedMentionIndex: 0,
        isEmojiPickerOpen: false,
      };
    }

    render() {
      return (
        <ComposedComponent
          senderId={this.props.senderId}
          messageContent={this.state.messageContent}
          color={this.props.color}
          dateAdded={this.props.dateAdded}
          // emoji picker stuff
          onEmojiPick={this.onEmojiPick}
          setReactQuillRef={this.setReactQuillRef}
          onSetQuillWrapperRef={this.onSetQuillWrapperRef}
          onSetToolbarRef={this.onSetToolbarRef}
          updateMessageNewText={this.onUpdateMessage}
          onMessageEditCancelled={this.handleEditCancelled}
          onMessageEditConfirmed={this.handleEditConfirmed}
          onKeyDown={this.handleKeyDown}
        />
      );
    }

    setReactQuillRef(ref) {
      this.reactQuillRef = ref;
    }

    onUpdateMessage(value, delta, source, editor) {
      const { ops } = delta;
      if (
        !(
          ops.length === 2 &&
          (ops[0].insert === "↵" || ops[0].insert === "\n") &&
          ops[1].delete
        )
      ) {
        this.setState({
          messageContent: editor.getContents(),
          selectedMentionIndex: 0,
        });
      }
    }

    handleEditCancelled() {
      this.props.setIsMessageBeingEdited(false);
      this.props.focusNewMessageEditor();
      this.props.onCloseMessageEdit();
    }

    handleKeyDown(event) {
      if (event.key === "Escape") {
        this.handleEditCancelled();
      }
    }

    handleEditConfirmed() {
      this.props.setIsMessageBeingEdited(false);
      this.props.onMessageEdit(this.state.messageContent);
      this.props.focusNewMessageEditor();
      this.props.onCloseMessageEdit();
    }

    // emoji picker handlers
    onEmojiPick(emoji, event) {
      this.quillRef.focus();
      const selection = this.quillRef.getSelection();

      if (!selection) {
        return;
      }

      this.quillRef.insertEmbed(
        selection.index,
        "emoji",
        emoji,
        Quill.sources.API
      );
      this.quillRef.setSelection(selection.index + 1, Quill.sources.API);

      this.setState({
        isEmojiPickerOpen: false,
      });
    }

    attachQuillRefs() {
      if (
        this.reactQuillRef &&
        typeof this.reactQuillRef.getEditor === "function"
      ) {
        this.quillRef = this.reactQuillRef.getEditor();
      }
    }

    onSetQuillWrapperRef(ref) {
      this.quillWrapperRef = ref;
    }

    onSetToolbarRef(ref) {
      this.toolbarRef = ref;
    }

    componentDidMount() {
      this.attachQuillRefs();
      if (this.quillRef) {
        this.quillRef.setSelection(this.quillRef.getLength() - 1);
        this.quillRef.focus();
      }
      if (this.quillWrapperRef) {
        this.scrollIntoViewTimeout = setTimeout(() => {
          scrollIntoViewIfNeeded(this.quillWrapperRef, {
            duration: 300,
            block: "nearest",
            scrollMode: "if-needed",
            behavior: "smooth",
          });
        }, 0);
      }
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
      this.attachQuillRefs();
    }

    componentWillUnmount() {
      if (this.scrollIntoViewTimeout) {
        clearTimeout(this.scrollIntoViewTimeout);
      }
    }
  }

  function mapStateToProps(state, props) {
    return {
      text: selectMessageText(state, { messageId: props.messageId }),
      senderId: selectMessageUser(state, { messageId: props.messageId }),
      userNicknamesByIds: selectUsersNicknames(state),
      dateAdded: selectMessageCreatedAt(state, { messageId: props.messageId }),
    };
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      updateMessageNewText: (newText) =>
        dispatch(
          MessagesModelActions.updateMessageNewText(props.messageId, newText)
        ),
      setIsMessageBeingEdited: (isBeingEdited) =>
        dispatch(
          MessagesModelActions.setIsMessageBeingEdited(
            props.messageId,
            isBeingEdited
          )
        ),
      onMessageEdit: (newText) =>
        dispatch(MessagesModelActions.onMessageEdit(props.messageId, newText)),
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceMessageBeingEdited);
}

export default Enhance;
