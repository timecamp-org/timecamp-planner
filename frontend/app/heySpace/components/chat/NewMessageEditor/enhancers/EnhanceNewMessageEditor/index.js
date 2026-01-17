import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { timestampNow } from 'common/utils/epoch';
import { isValidEmail } from 'common/utils/validation';
import generateId from 'common/utils/generate-pushid';
import { doNothing } from 'common/utils';
import { isValidPrintableKey } from 'common/utils/validation';
import get from 'lodash/get';
import set from 'lodash/set';
import { List, is } from 'immutable';
import { MentionType } from 'models/domain/MessagesModel/types';
import { AppEventEmitter } from 'common/services';
import { AppEventType } from 'common/types';

import { emojiIndex } from 'emoji-mart';

import { Quill } from 'react-quill';
import fuzzysearch from 'fuzzysearch';
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants';
import { UserTracker } from 'common/services';

import PureBaseComponent from 'commonEnhancers/PureBaseComponent';

import { selectUsersProjectMentionData } from 'models/domain/UsersModel/selectors';
import { selectCurrentUserId, selectUserIdsByEmails } from 'models/domain/UsersModel/selectors/domain';
import { selectCurrentUserLastTextMessageIdInObject } from 'models/domain/MessagesModel/selectors';
import { selectObjectNewMessageContent } from 'models/domain/MessagesModel/selectors/domain';
import { emptyDelta } from 'models/domain/MessagesModel/constants';
import {
  createMarkdownLink,
  getFilteredMentionSuggestion,
  createMentionComparatorForPhrase,
} from 'models/domain/MessagesModel/utils';
import * as MessagesModelActions from 'models/domain/MessagesModel/actions';
import * as PopUpAlertsModelActions from 'models/component/PopUpAlertsModel/actions';
import { HumanMessage } from 'models/domain/HumanMessageModel/models';
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types';
import {
  selectProjectColor,
  selectProjectIsDirectChat,
  selectChatMessagePlaceholder,
  selectIsCurrentUserProjectMember,
} from 'models/domain/ProjectsModel/selectors';
import { selectTaskColor, selectProjectIdByTaskId } from 'models/domain/TasksModel/selectors';
import { selectOpenedCardDetailsModalId } from 'models/domain/AppModel/selectors';

import EnhanceWithClickOutside from 'react-click-outside';
import { onCreateUserAndAddToSubscribers, onMemberAdd } from 'models/domain/ProjectsModel/actions';
import { ProjectPeopleRole } from 'models/domain/ProjectsModel/types';
import { selectEntityType } from 'models/domain/EntityModel/selectors';
import { EntityType } from 'models/domain/EntityModel/types';
import { selectImageGalleryObjectId } from 'models/domain/FilesModel/selectors';
import { selectCanUsersBeInvitedToWorkspace } from 'models/domain/SubscriptionLimitsModel/selectors';
import { selectIsCurrentUserOrganizationGuest } from 'models/domain/OrganizationsModel/selectors';
import { i18n } from 'i18n';
import mentionBlot from '../../mentionBlot';

const Delta = Quill.import('delta');
const emptyArray = [];

function enhance(ComposedComponent) {
  @EnhanceWithClickOutside
  class EnhanceNewMessageEditor extends PureBaseComponent {
    static propTypes = {
      onOpenFilePrompt: PropTypes.func.isRequired,
      setNewMessageEditorRef: PropTypes.func,
      className: PropTypes.string,
      // uses
      objectId: PropTypes.string.isRequired,
      shouldFocusOnMount: PropTypes.bool.isRequired,
      onSendMessageCallback: PropTypes.func,
      // injects
      mentionSuggestions: ImmutablePropTypes.list.isRequired,
      messageContent: PropTypes.object.isRequired,
      currentUserId: PropTypes.string.isRequired,
      currentUserLastMessageIdInObject: PropTypes.string,
      color: PropTypes.string,
      openedCardDetailsModalId: PropTypes.string,
      placeholder: PropTypes.string,
      isProjectDirectChat: PropTypes.bool.isRequired,
      canUserBeInvitedToWorkspace: PropTypes.bool.isRequired,

      onUpdateMessage: PropTypes.func.isRequired,
      onRetrieveLocalStoredNewMessage: PropTypes.func.isRequired,
      onMessageSend: PropTypes.func.isRequired,
      onUpdateMessageKeyPress: PropTypes.func.isRequired,
      onPaste: PropTypes.func.isRequired,
      onEditCurrentUserLastMessage: PropTypes.func.isRequired,
      onCreateUserAndAddToSubscribers: PropTypes.func.isRequired,
      onAddAlert: PropTypes.func.isRequired,
    };

    static defaultProps = {
      shouldFocusOnMount: false,
      setNewMessageEditorRef: doNothing,
      onSendMessageCallback: doNothing,
    };

    state = {
      isMentionsTooltipOpen: false,
      selectedMentionIndex: 0,
      searchPhrase: '',
      atPosition: 0,
      mentionSuggestions: this.props.mentionSuggestions,
      isEmojiPickerOpen: false,
      isFocused: false,
      messageContent: this.props.messageContent || emptyDelta,

      // inline emoji
      isEmojiListOpen: false,
      selectedEmojiIndex: 0,
      emojiSearchPhrase: '',
      emojiSuggestions: emptyArray,
    };

    reactQuillRef = null;
    reactQuillWrapperRef = null;
    quillRef = null;
    cursorPosition = 0;
    openingColonPosition = null;
    shouldUpdateKeyPress = true;
    emailInMention = '';

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          newMessageWrapperClassName={this.props.newMessageWrapperClassName}
          toolbarClassName={this.props.toolbarClassName}
          objectId={this.props.objectId}
          color={this.props.color}
          isCurrentUserOrganizationGuest={this.props.isCurrentUserOrganizationGuest}
          messageContent={this.state.messageContent}
          mentionSuggestions={this.state.mentionSuggestions}
          mentionSuggestionContainerStyles={this.getMentionSuggestionContainerStyles()}
          isMentionsTooltipOpen={this.state.isMentionsTooltipOpen}
          selectedMentionIndex={this.state.selectedMentionIndex}
          searchPhrase={this.state.searchPhrase}
          openedCardDetailsModalId={this.props.openedCardDetailsModalId}
          // emoji picker stuff
          onEmojiPick={this.onEmojiPick}
          onEmojiToolbarIconClick={this.onEmojiToolbarIconClick}
          // inline emoji stuff
          isEmojiListOpen={this.state.isEmojiListOpen}
          selectedEmojiIndex={this.state.selectedEmojiIndex}
          emojiSuggestions={this.state.emojiSuggestions}
          onOpenEmojiList={this.onOpenEmojiList}
          onCloseEmojiList={this.onCloseEmojiList}
          onSelectPrevEmoji={this.onSelectPrevEmoji}
          onSelectNextEmoji={this.onSelectNextEmoji}
          onSelectEmoji={this.onSelectEmoji}
          onSetEmojiSearchPhrase={this.onSetEmojiSearchPhrase}
          onSetOpeningColonPosition={this.onSetOpeningColonPosition}
          onPickEmojiFromDropdown={this.onPickEmojiFromDropdown}
          // mention handlers
          onInsertMentionToolbarIconClick={this.onInsertMentionToolbarIconClick}
          setReactQuillRef={this.setReactQuillRef}
          setReactQuillWrapperRef={this.setReactQuillWrapperRef}
          onSetSearchPhrase={this.onSetSearchPhrase}
          onSetAtPosition={this.onSetAtPosition}
          onSetCursorPosition={this.onSetCursorPosition}
          onSetMentionsTooltipIsOpen={this.onSetMentionsTooltipIsOpen}
          onSelectPrevItem={this.onSelectPrevItem}
          onSelectNextItem={this.onSelectNextItem}
          onSelectItem={this.onSelectItem}
          onSelectMention={this.onSelectMention}
          // Giphy
          onGiphyPick={this.onGiphyPick}
          // handlers
          onUpdateMessage={this.onUpdateMessage}
          onSendMessage={this.onSendMessage}
          onUpdateMessageKeyPress={this.onUpdateMessageKeyPress}
          onKeyDown={this.onKeyDown}
          onFocus={this.onFocus}
          onQuillBlur={this.onQuillBlur}
          onEditCurrentUserLastMessage={this.onEditCurrentUserLastMessage}
          onInviteUser={this.onInviteUser}
          onOpenFilePrompt={this.props.onOpenFilePrompt}
          onClick={this.onClick}
          onPaste={this.props.onPaste}
          onGoogleDrivePick={this.onGoogleDrivePick}
          onDropboxFilesPick={this.onDropboxFilesPick}
          isFocused={this.state.isFocused}
          onBlur={this.onBlur}
        />
      );
    }

    onBlur(event) {
      const { currentTarget } = event;
      const { objectId } = this.props;
      const { messageContent } = this.state;
      setImmediate(() => {
        if (!currentTarget.contains(document.activeElement)) {
          this.isFocused = false;
          this.props.onUpdateMessage(objectId, messageContent, true);
        }
      });
    }

    onClickOutside = (e) => {
      if (this.reactQuillWrapperRef.contains(e.target)) {
        this.setIsFocused(true);
      } else {
        this.isFocused = false;
        this.setIsFocused(false);
      }
    };

    setIsFocused(isFocused) {
      this.setState({ isFocused });
    }

    onClick() {
      this.setIsFocused(true);
      this.quillRef.focus();
    }

    setReactQuillRef(ref) {
      this.reactQuillRef = ref;
    }

    setReactQuillWrapperRef(ref) {
      this.reactQuillWrapperRef = ref;
    }

    onUpdateMessage(value, delta, source, editor) {
      const { ops } = delta;
      if (!(ops.length === 2 && (ops[0].insert === '↵' || ops[0].insert === '\n') && ops[1].delete)) {
        this.setState({ messageContent: editor.getContents() });
      }

      this.setState({
        selectedMentionIndex: 0,
      });
    }

    onUpdateMessageKeyPress() {
      if (this.shouldUpdateKeyPress) {
        this.props.onUpdateMessageKeyPress(timestampNow());
        this.shouldUpdateKeyPress = false;

        this.keyPressTimeout = setTimeout(() => {
          this.shouldUpdateKeyPress = true;
        }, 1000 * 4);
      }
    }

    onKeyDown(event) {
      switch (event.key) {
        case 'Escape': {
          event.stopPropagation();
          break;
        }
        case 'b': {
          if (event.metaKey || event.ctrlKey) {
            this.surroundSelectionWithMarkdownToken('*');
          }
          break;
        }
        case 'i': {
          if (event.metaKey || event.ctrlKey) {
            this.surroundSelectionWithMarkdownToken('_');
          }
          break;
        }
        case 'x': {
          if ((event.metaKey || event.ctrlKey) && event.shiftKey) {
            this.surroundSelectionWithMarkdownToken('~');
          }
          break;
        }
        default: {
          break;
        }
      }
    }

    surroundSelectionWithMarkdownToken(token) {
      const selection = this.quillRef.getSelection();
      if (!selection) {
        return;
      }
      const { index: selectionIndex, length: selectionLength } = selection;
      if (selectionLength === 0) {
        this.quillRef.insertText(selectionIndex, `${token}${token}`, Quill.sources.API);
        this.quillRef.setSelection(selectionIndex + 1, 0, Quill.sources.API);
      } else {
        this.quillRef.insertText(selectionIndex, token, Quill.sources.API);
        this.quillRef.insertText(selectionIndex + selectionLength + 1, token, Quill.sources.API);
        this.quillRef.setSelection(selectionIndex, selectionLength + 2, Quill.sources.API);
      }
    }

    onFocus(range, source, editor) {
      this.isFocused = true;
      this.setIsFocused(true);
    }

    onQuillBlur(previousRange, source, editor) {
      if (previousRange) {
        this.onSetCursorPosition(previousRange.index);
      }
    }

    onSetSearchPhrase(searchPhrase) {
      this.setState({
        searchPhrase,
        mentionSuggestions: this.filterMentionSuggestions(searchPhrase),
      });
    }

    onSetAtPosition(position) {
      this.setState({
        atPosition: position,
      });
    }

    onSetCursorPosition(position) {
      this.cursorPosition = position;
    }

    onSetMentionsTooltipIsOpen(isOpen) {
      const newState = {
        isMentionsTooltipOpen: isOpen,
      };
      if (!isOpen) {
        newState.mentionSuggestions = this.props.mentionSuggestions;
        newState.searchPhrase = '';
      }
      this.setState(newState);
    }

    onEmojiToolbarIconClick(isPickerOpen) {
      if (isPickerOpen) {
        this.onSetMentionsTooltipIsOpen(false);
      }
    }

    onSelectPrevItem() {
      this.setState((prevState) => ({
        selectedMentionIndex:
          (prevState.selectedMentionIndex + this.state.mentionSuggestions.size - 1) %
          this.state.mentionSuggestions.size,
      }));
    }

    onSelectNextItem() {
      this.setState((prevState) => ({
        selectedMentionIndex: (prevState.selectedMentionIndex + 1) % this.state.mentionSuggestions.size,
      }));
    }

    onSelectItem(index) {
      this.setState({
        selectedMentionIndex: index,
      });
    }

    onSelectMention(fromMentionsModule, index, phraseInsertedBeforeSpace) {
      if (fromMentionsModule) {
        if (this.state.isMentionsTooltipOpen) {
          if (phraseInsertedBeforeSpace) {
            const data = this.state.mentionSuggestions
              .filter((mentionData) => mentionData.displayValue === phraseInsertedBeforeSpace)
              .first();
            if (data) {
              this.insertMention(data);
              this.setState({
                isMentionsTooltipOpen: false,
              });
              return {
                wasMentionInserted: true,
                wasUserInviting: true,
              };
            } else {
              return {
                wasMentionInserted: false,
                wasUserInviting: false,
              };
            }
          }
          const data = this.state.mentionSuggestions.get(this.state.selectedMentionIndex);
          if (data) {
            this.insertMention(data);
            this.setState({
              isMentionsTooltipOpen: false,
            });
            return {
              wasMentionInserted: true,
              wasUserInviting: false,
            };
          } else {
            const wasUserSuccessfullyInvited = this.onInviteUser();
            if (wasUserSuccessfullyInvited) {
              this.setState({
                isMentionsTooltipOpen: false,
              });
              return {
                wasMentionInserted: true,
                wasUserInviting: true,
              };
            } else {
              return {
                wasMentionInserted: false,
                wasUserInviting: true,
              };
            }
          }
        }
        return {
          wasMentionInserted: false,
          wasUserInviting: false,
        };
      }

      this.insertMention(this.state.mentionSuggestions.get(index));
      this.setState({
        isMentionsTooltipOpen: false,
      });
      return true;
    }

    insertMention(data) {
      this.quillRef.deleteText(this.state.atPosition, this.cursorPosition - this.state.atPosition, Quill.sources.API);
      this.quillRef.insertEmbed(this.state.atPosition, 'mention', data, Quill.sources.API);
      this.quillRef.insertText(this.state.atPosition + 1, ' ', Quill.sources.API);
      this.quillRef.setSelection(this.state.atPosition + 2, Quill.sources.API);
    }

    updateMention(data, oldUserId) {
      const currentDelta = this.quillRef.getContents();
      let mentionOperation = this.getMentionOperationForUser(currentDelta.ops, oldUserId);
      if (mentionOperation) {
        mentionOperation = set(mentionOperation, `insert.mention.userId`, data.userId);
        this.quillRef.setContents(currentDelta, Quill.sources.API);
        this.quillRef.setSelection(this.cursorPosition, Quill.sources.API);
      }
    }

    getMentionOperationForUser(operations = emptyArray, userId) {
      if (!userId) {
        return null;
      }
      return operations.find((op) => get(op, `insert.mention.userId`) === userId);
    }

    onSendMessage(ops) {
      const messageContent = ops ? new Delta(ops) : this.state.messageContent;
      this.props.onMessageSend(messageContent);
      this.props.onUpdateMessage(this.props.objectId, emptyDelta, true);
      this.setState({ messageContent: emptyDelta });
      this.props.onRemovePersistentMessageContent(this.props.objectId);
      this.quillRef.setContents(emptyDelta);
      this.props.onUpdateMessageKeyPress(null);
      this.shouldUpdateKeyPress = true;
      if (this.props.objectType === EntityType.PROJECT_DATA && !this.props.isCurrentUserProjectMember) {
        this.props.onMemberAdd(this.props.currentUserId);
      }
      this.emailInMention = '';
    }

    filterMentionSuggestions(searchPhrase) {
      searchPhrase = searchPhrase.toLowerCase();
      const filteredMentionSuggestions = getFilteredMentionSuggestion(searchPhrase, this.props.mentionSuggestions);

      let globalMentions;
      if (this.props.objectType === EntityType.PROJECT_DATA) {
        if (!this.props.isProjectDirectChat) {
          globalMentions = new List([
            {
              displayValue: 'channel',
              type: MentionType.SPACE,
              description: i18n.t('Notifies everyone in project'),
            },
            {
              displayValue: 'project',
              type: MentionType.SPACE,
              description: i18n.t('Notifies everyone in project'),
            },
            {
              displayValue: 'here',
              type: MentionType.HERE,
              description: i18n.t('Notifies online users in project'),
            },
          ]);
        } else {
          // ok
        }
      } else if (this.props.objectType === EntityType.TASK_DATA) {
        globalMentions = new List([
          {
            displayValue: 'channel',
            type: MentionType.SPACE,
            description: i18n.t('Notifies everyone in project'),
          },
          {
            displayValue: 'project',
            type: MentionType.SPACE,
            description: i18n.t('Notifies everyone in project'),
          },
          {
            displayValue: 'here',
            type: MentionType.HERE,
            description: i18n.t('Notifies online users who follow task'),
          },
        ]);
      } else {
        // ok
      }

      const filteredMentionList = globalMentions
        ? filteredMentionSuggestions.concat(
            globalMentions.filter((globalMention) =>
              fuzzysearch(searchPhrase || this.state.searchPhrase.toLowerCase(), globalMention.displayValue)
            )
          )
        : filteredMentionSuggestions;
      return filteredMentionList.sort(createMentionComparatorForPhrase(searchPhrase));
    }

    onInviteUser() {
      if (this.props.isCurrentUserOrganizationGuest) {
        return false;
      }
      const email = this.state.searchPhrase;
      const emailValidationResult = isValidEmail(email, true);
      if (emailValidationResult.isValid) {
        if (!this.props.canUserBeInvitedToWorkspace) {
          this.props.onAddAlert(
            i18n.t(
              'Oops. You have reached the limit of 5 users per workspace. Upgrade to Premium to enjoy full features of Planner!',
              'users-count-in-workspace-exceeded'
            )
          );
          return false;
        }
        const userId = generateId('user');
        this.onSetMentionsTooltipIsOpen(false);
        this.props.onCreateUserAndAddToSubscribers(this.props.projectId, userId, email);
        UserTracker.track(UserTrackerEvent.memberInvited, {
          source: 'mention',
        });
        const mentionData = this.getMentionData(email, userId);
        this.emailInMention = email;
        this.insertMention(mentionData);
        this.onSetCursorPosition(this.cursorPosition - email.length + 1);
        return true;
      } else {
        this.props.onAddAlert(emailValidationResult.message);
        return false;
      }
    }

    getMentionData(email, userId) {
      const username = email.split('@')[0];
      return {
        username,
        userId,
        type: MentionType.USER,
        displayValue: username,
      };
    }

    getMentionSuggestionContainerStyles() {
      if (this.quillRef) {
        const containerPos = this.quillRef.container.getBoundingClientRect();

        return {
          bottom: `${this.quillRef.container.clientHeight + 25}px`,
          left: `0`,
          right: `0`,
          maxHeight: `${containerPos.top - 85}px`,
        };
      } else {
        return {};
      }
    }

    // emoji picker handlers
    onEmojiPick(emoji) {
      this.quillRef.focus();
      const selection = this.quillRef.getSelection();

      if (!selection) {
        return;
      }

      this.quillRef.insertEmbed(selection.index, 'emoji', emoji, Quill.sources.API);
      this.quillRef.setSelection(selection.index + 1, Quill.sources.API);
    }

    // inline emoji handlers
    onOpenEmojiList() {
      this.setState({
        isEmojiListOpen: true,
      });
    }

    onCloseEmojiList() {
      if (this.state.isEmojiListOpen) {
        this.setState({
          isEmojiListOpen: false,
          emojiSearchPhrase: '',
          emojiSuggestions: emptyArray,
        });
      }
    }

    onSelectEmoji(index) {
      this.setState({
        selectedEmojiIndex: index,
      });
    }

    onSelectPrevEmoji() {
      this.setState((prevState) => ({
        selectedEmojiIndex:
          (prevState.selectedEmojiIndex + this.state.emojiSuggestions.length - 1) % this.state.emojiSuggestions.length,
      }));
    }

    onSelectNextEmoji() {
      this.setState((prevState) => ({
        selectedEmojiIndex: (prevState.selectedEmojiIndex + 1) % this.state.emojiSuggestions.length,
      }));
    }

    onSetEmojiSearchPhrase(emojiSearchPhrase) {
      this.setState({
        emojiSearchPhrase,
        emojiSuggestions: this.filterEmojiSuggestions(emojiSearchPhrase),
        selectedEmojiIndex: 0,
      });
    }

    filterEmojiSuggestions(emojiSearchPhrase) {
      return emojiIndex.search(emojiSearchPhrase).filter((emojiData) => {
        const { colons } = emojiData;
        return colons.indexOf(emojiSearchPhrase) !== -1;
      });
    }

    onSetOpeningColonPosition(openingColonPosition) {
      this.openingColonPosition = openingColonPosition;
    }

    onPickEmojiFromDropdown(selectedEmojiIndex) {
      let pickedEmoji;
      if (selectedEmojiIndex) {
        pickedEmoji = this.state.emojiSuggestions[selectedEmojiIndex];
      } else {
        pickedEmoji = this.state.emojiSuggestions[this.state.selectedEmojiIndex];
      }

      if (pickedEmoji) {
        this.quillRef.deleteText(
          this.openingColonPosition,
          Math.max(0, this.cursorPosition - this.openingColonPosition),
          Quill.sources.API
        );
        this.quillRef.insertEmbed(this.openingColonPosition, 'emoji', pickedEmoji, Quill.sources.API);
        this.quillRef.insertText(this.openingColonPosition + 1, ' ', Quill.sources.API);
        this.quillRef.setSelection(this.openingColonPosition + 2, Quill.sources.API);

        this.onSetCursorPosition(this.cursorPosition - (this.cursorPosition - this.openingColonPosition));
        this.onSetOpeningColonPosition(null);

        this.setState({
          isEmojiListOpen: false,
        });
      } else {
        this.onSendMessage();
      }
    }

    onInsertMentionToolbarIconClick() {
      const currentSelection = this.quillRef.getSelection();
      const insertIndex =
        this.cursorPosition !== null ? this.cursorPosition : get(currentSelection, 'index', this.quillRef.getLength());

      this.quillRef.insertText(insertIndex, '@', Quill.sources.USER);
      this.quillRef.setSelection(insertIndex + 1, 0, Quill.sources.USER);
      this.quillRef.focus();
    }

    onEditCurrentUserLastMessage() {
      if (this.props.currentUserLastMessageIdInObject) {
        this.props.onEditCurrentUserLastMessage(this.props.currentUserLastMessageIdInObject);
      } else {
        // ok
      }
    }

    attachQuillRefs() {
      if (this.reactQuillRef && typeof this.reactQuillRef.getEditor === 'function') {
        this.quillRef = this.reactQuillRef.getEditor();
        this.props.setNewMessageEditorRef(this.quillRef);
      }
    }

    onWindowKeyDown(event) {
      const editedMessage = document.getElementById('editedMessage');
      const universalModal = document.getElementById('commonComponents/UniversalModal');
      const isOtherQuillEditorFocused = document.activeElement.className.includes('ql-editor');
      const anyInputIsFocused = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
      const isValidKey =
        (isValidPrintableKey(event.keyCode) || event.altKey) &&
        !event.ctrlKey &&
        !event.metaKey &&
        event.key !== 'Enter';

      if (
        this.quillRef &&
        !editedMessage &&
        !anyInputIsFocused &&
        isValidKey &&
        !isOtherQuillEditorFocused &&
        (!universalModal || universalModal.contains(this.quillRef.root)) &&
        !this.props.imageGalleryObjectId
      ) {
        this.onFocusQuill();
      }
    }

    attachFocusListeners() {
      window.addEventListener('keydown', this.onWindowKeyDown);
      AppEventEmitter.on(AppEventType.FOCUS_MESSAGE_INPUT, this.onFocusQuill);
    }

    detachFocusListeners() {
      window.removeEventListener('keydown', this.onWindowKeyDown);
      AppEventEmitter.off(AppEventType.FOCUS_MESSAGE_INPUT, this.onFocusQuill);
    }

    isUserIdsByEmailsChanged(prevProps) {
      return !is(this.props.userIdsByEmails, prevProps.userIdsByEmails);
    }

    onGoogleDrivePick(files) {
      let message = '';
      files.forEach((file) => {
        message += `${createMarkdownLink(file.url, file.name)} `;
      });
      if (message.length > 0) {
        this.props.onMessageSend(message);
      }
    }

    onDropboxFilesPick(files) {
      let message = '';
      files.forEach((file) => {
        message += `${createMarkdownLink(file.link, file.name)} `;
      });
      if (message.length > 0) {
        this.props.onMessageSend(message);
      }
    }

    onFocusQuill() {
      setImmediate(() => {
        this.isFocused = true;
        this.setIsFocused(true);
        this.quillRef.focus();
        this.quillRef.setSelection(this.quillRef.getLength() - 1);
      });
    }

    isQuillOpsChanged(prevProps) {
      const isChangedFromEmpty =
        this.isEmptyMessage(prevProps.messageContent) && !this.isEmptyMessage(this.props.messageContent);
      const isChangedOps = prevProps.messageContent.ops.length !== this.props.messageContent.ops.length;
      return isChangedFromEmpty || isChangedOps;
    }

    isEmptyMessage(messageContent) {
      if (messageContent.ops.length > 1) {
        return false;
      }
      return messageContent.ops[0].insert === '\n';
    }

    // emoji picker handlers
    onGiphyPick(giphyEntry) {
      if (!giphyEntry) {
        return;
      }
      const url = get(giphyEntry, 'images.downsized.url');
      const title = get(giphyEntry, 'title');

      if (url) {
        const giphyMessage = `[${title || url}](${url})`;
        const giphContent = new Delta().insert(giphyMessage);
        this.props.onMessageSend(giphContent);
      }
    }

    componentDidMount() {
      this.attachQuillRefs();
      mentionBlot(this.props.color);
      this.props.onRetrieveLocalStoredNewMessage(this.props.objectId);

      this.attachFocusListeners();
      this.quillRef.root.dataset.placeholder = this.props.placeholder;

      if (this.props.shouldFocusOnMount) {
        this.onFocusQuill();
      }

      document.addEventListener('click', this.onClickOutside);
    }

    componentDidUpdate(prevProps) {
      this.attachQuillRefs();

      if (prevProps.color !== this.props.color) {
        mentionBlot(this.props.color);
      } else if (this.props.openedCardDetailsModalId && !prevProps.openedCardDetailsModalId) {
        mentionBlot(this.props.color);
      }

      if (prevProps.objectId !== this.props.objectId) {
        this.props.onRetrieveLocalStoredNewMessage(this.props.objectId);
        this.quillRef.root.dataset.placeholder = this.props.placeholder;
        this.quillRef.setContents(this.state.messageContent);
        this.setState({
          isMentionsTooltipOpen: false,
          selectedMentionIndex: 0,
          searchPhrase: '',
          atPosition: 0,
          cursorPosition: 0,
          messageContent: this.props.messageContent,
        });
        this.emailInMention = '';
        if (this.props.shouldFocusOnMount) {
          this.onFocusQuill();
        }
      }

      if (this.isQuillOpsChanged(prevProps)) {
        this.setState({ messageContent: this.props.messageContent });
      }

      if (prevProps.placeholder !== this.props.placeholder) {
        this.quillRef.root.dataset.placeholder = this.props.placeholder;
      }

      if (this.isUserIdsByEmailsChanged(prevProps)) {
        const email = this.emailInMention;
        const emailValidationResult = isValidEmail(email, true);
        if (emailValidationResult.isValid) {
          const previousUserId = prevProps.userIdsByEmails.get(email);
          const currentUserId = this.props.userIdsByEmails.get(email);
          if (currentUserId && previousUserId !== currentUserId) {
            const mentionData = this.getMentionData(email, currentUserId);
            this.updateMention(mentionData, previousUserId);
          }
        }
      }

      if (prevProps.objectType === EntityType.PROJECT_DATA) {
        if (!prevProps.openedCardDetailsModalId && this.props.openedCardDetailsModalId) {
          this.detachFocusListeners();
        } else if (prevProps.openedCardDetailsModalId && !this.props.openedCardDetailsModalId) {
          this.attachFocusListeners();
        }
      }
    }

    componentWillUnmount() {
      document.removeEventListener('click', this.onClickOutside);
      this.detachFocusListeners();
      if (this.keyPressTimeout) {
        clearTimeout(this.keyPressTimeout);
      }
    }
  }

  const mapStateToProps = (state, props) => {
    const objectType = selectEntityType(state, { entityId: props.objectId });
    const projectId =
      objectType === EntityType.TASK_DATA ? selectProjectIdByTaskId(state, { taskId: props.objectId }) : props.objectId;
    return {
      messageContent: selectObjectNewMessageContent(state, {
        objectId: props.objectId,
      }),
      mentionSuggestions: selectUsersProjectMentionData(state, { projectId }),
      userIdsByEmails: selectUserIdsByEmails(state),
      currentUserId: selectCurrentUserId(state),
      currentUserLastMessageIdInObject: selectCurrentUserLastTextMessageIdInObject(state, {
        objectId: props.objectId,
      }),
      openedCardDetailsModalId: selectOpenedCardDetailsModalId(state),
      color:
        objectType === EntityType.TASK_DATA
          ? selectTaskColor(state, { taskId: props.objectId })
          : selectProjectColor(state, { projectId: props.objectId }),
      isProjectDirectChat: selectProjectIsDirectChat(state, {
        projectId: props.objectId,
      }),
      placeholder:
        objectType === EntityType.TASK_DATA
          ? i18n.t('Write a comment...')
          : `${selectChatMessagePlaceholder(state, {
              projectId: props.objectId,
            })}`,
      objectType,
      imageGalleryObjectId: selectImageGalleryObjectId(state),
      projectId,
      canUserBeInvitedToWorkspace: selectCanUsersBeInvitedToWorkspace(state, {
        usersToInviteCount: 1,
      }),
      isCurrentUserOrganizationGuest: selectIsCurrentUserOrganizationGuest(state, { usersToInviteCount: 1 }),
      isCurrentUserProjectMember: selectIsCurrentUserProjectMember(state, {
        projectId,
      }),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onUpdateMessage: (objectId, newContent, ignoreDebounce) =>
      dispatch(MessagesModelActions.onUpdateNewMessageContent(newContent, objectId, ignoreDebounce)),
    onRemovePersistentMessageContent: (objectId) =>
      dispatch(MessagesModelActions.onRemovePersistentMessageContent(objectId)),
    onRetrieveLocalStoredNewMessage: (objectId) =>
      dispatch(MessagesModelActions.onRetrieveLocalStoredNewMessage(objectId)),
    onMessageSend: (messageContent) => dispatch(MessagesModelActions.onMessageSend(messageContent, props.objectId)),
    onUpdateMessageKeyPress: (timestamp) =>
      dispatch(MessagesModelActions.onUpdateMessageKeyPress(props.objectId, undefined, timestamp)),
    onAddAlert: (message, id = '') =>
      dispatch(
        PopUpAlertsModelActions.onAddAlert(
          {
            humanMessage: HumanMessage({
              kind: HumanMessageKind.error,
              text: message,
            }),
          },
          id
        )
      ),
    onEditCurrentUserLastMessage: (messageId) => {
      dispatch(MessagesModelActions.setIsMessageBeingEdited(messageId, true));
    },
    onCreateUserAndAddToSubscribers: (projectId, userId, email) =>
      dispatch(onCreateUserAndAddToSubscribers(projectId, email, ProjectPeopleRole.MEMBER, userId)),
    onMemberAdd: (userId) => dispatch(onMemberAdd(props.objectId, userId, ProjectPeopleRole.MEMBER)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceNewMessageEditor);
}

export default enhance;
