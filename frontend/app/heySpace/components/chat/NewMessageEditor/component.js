import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ReactQuill, { Quill } from 'react-quill';

import { doNothing } from 'common/utils';
import { ArrowDown, ArrowUp } from 'commonComponents/Icons';
import { UnderlinedControlledInputWrapper } from 'commonComponents/UnderlinedControlledInputWrapper/UnderlinedControlledInputWrapper';
import SecondaryButton from 'components/buttons/SecondaryButton';
import MessageEditorToolbar from 'components/chat/MessageEditorToolbar';
import PersonIcon from 'components/person/PersonIcon';
import { i18n } from 'i18n';
import { quillFormats } from 'models/domain/MessagesModel/constants/quillEditorConstants';
import { MentionType } from 'models/domain/MessagesModel/types';
import commonStyles from 'styles/common.css';

import mentionsStyles from './mentionsStyles.css';
import styles from './styles.css';

import 'react-quill/dist/quill.bubble.css';
import './editLastMessage';
import './emojiBlot';
import './emojisModule';
import './mentionsModule';
import './onSendMessageModule';

import { Emoji } from 'emoji-mart';

const avatarSize = 6 * parseInt(commonStyles.gridCellSize, 10);

const Delta = Quill.import('delta');

NewMessageEditor.propTypes = {
  className: PropTypes.string,
  newMessageWrapperClassName: PropTypes.string,
  toolbarClassName: PropTypes.string,
  objectId: PropTypes.string.isRequired,
  color: PropTypes.string,
  isCurrentUserOrganizationGuest: PropTypes.bool,
  messageContent: PropTypes.object.isRequired,
  mentionSuggestions: ImmutablePropTypes.list.isRequired,
  mentionSuggestionContainerStyles: PropTypes.object,

  isMentionsTooltipOpen: PropTypes.bool,
  isFocused: PropTypes.bool,
  selectedMentionIndex: PropTypes.number,
  searchPhrase: PropTypes.string,
  openedCardDetailsModalId: PropTypes.string,
  onClick: PropTypes.func,

  // emoji picker stuff
  onEmojiPick: PropTypes.func,
  onEmojiToolbarIconClick: PropTypes.func,

  // inline emojis
  isEmojiListOpen: PropTypes.bool,
  onOpenEmojiList: PropTypes.func,
  onCloseEmojiList: PropTypes.func,
  onSelectNextEmoji: PropTypes.func,
  onSelectPrevEmoji: PropTypes.func,
  onSelectEmoji: PropTypes.func,
  onSetEmojiSearchPhrase: PropTypes.func,
  onSetOpeningColonPosition: PropTypes.func,

  // mention handlers
  onInsertMentionToolbarIconClick: PropTypes.func,
  setReactQuillRef: PropTypes.func,
  setReactQuillWrapperRef: PropTypes.func,
  onSetSearchPhrase: PropTypes.func,
  onSetAtPosition: PropTypes.func,
  onSetCursorPosition: PropTypes.func,
  onSetMentionsTooltipIsOpen: PropTypes.func,
  onSelectPrevItem: PropTypes.func,
  onSelectNextItem: PropTypes.func,
  onSelectItem: PropTypes.func,
  onSelectMention: PropTypes.func,

  onUpdateMessage: PropTypes.func,
  onSendMessage: PropTypes.func,
  onUpdateMessageKeyPress: PropTypes.func,
  onFocus: PropTypes.func,
  onQuillBlur: PropTypes.func,
  onEditCurrentUserLastMessage: PropTypes.func,
  onInviteUser: PropTypes.func,
  onOpenFilePrompt: PropTypes.func,
  onGoogleDrivePick: PropTypes.func,
  onDropboxFilesPick: PropTypes.func,
};

NewMessageEditor.defaultProps = {
  mentionSuggestions: [],

  isMentionsTooltipOpen: false,
  isCurrentUserOrganizationGuest: false,
  isFocused: false,
  selectedMentionIndex: 0,
  searchPhrase: '',
  onClick: doNothing,

  // emoji picker stuff
  onEmojiPick: doNothing,
  onEmojiToolbarIconClick: doNothing,

  // inline emojis
  isEmojiListOpen: false,
  onOpenEmojiList: doNothing,
  onCloseEmojiList: doNothing,
  onSelectNextEmoji: doNothing,
  onSelectPrevEmoji: doNothing,
  onSelectEmoji: doNothing,
  onSetEmojiSearchPhrase: doNothing,
  onSetOpeningColonPosition: doNothing,

  // mention handlers
  onInsertMentionToolbarIconClick: doNothing,
  setReactQuillRef: doNothing,
  onSetSearchPhrase: doNothing,
  onSetAtPosition: doNothing,
  onSetCursorPosition: doNothing,
  onSetMentionsTooltipIsOpen: doNothing,
  onSelectPrevItem: doNothing,
  onSelectNextItem: doNothing,
  onSelectItem: doNothing,
  onSelectMention: doNothing,

  onUpdateMessage: doNothing,
  onFocus: doNothing,
  onQuillBlur: doNothing,
  onSendMessage: doNothing,
  onEditCurrentUserLastMessage: doNothing,
  onInviteUser: doNothing,
  onOpenFilePrompt: doNothing,
  onGoogleDrivePick: doNothing,
  onDropboxFilesPick: doNothing,
};

function NewMessageEditor(props) {
  const renderUserMentionSuggestion = (mention, index) => (
    <li
      key={mention.userId}
      className={mentionsStyles['ql-mention-list-item']}
      onMouseEnter={() => props.onSelectItem(index)}
      onClick={() => props.onSelectMention(false, index)}
    >
      <SecondaryButton
        className={mentionsStyles.mentionSuggestion}
        activeClassName={mentionsStyles['ql-mention-active-item']}
        color={props.color}
        isActive={props.selectedMentionIndex === index}
      >
        <PersonIcon userId={mention.userId} width={avatarSize} eight={avatarSize} />
        {!mention.isBot && <span className={styles.username}>{mention.displayValue}</span>}
        <span className={styles.fullName}>{mention.fullName}</span>
      </SecondaryButton>
    </li>
  );

  const renderGlobalMentionSuggestion = (mention, index) => (
    <li
      key={mention.displayValue}
      className={mentionsStyles['ql-mention-list-item']}
      onMouseEnter={() => props.onSelectItem(index)}
      onClick={() => props.onSelectMention(true)}
    >
      <SecondaryButton
        className={mentionsStyles.mentionSuggestion}
        color={props.color}
        activeClassName={mentionsStyles['ql-mention-active-item']}
        isActive={props.selectedMentionIndex === index}
      >
        <span className={styles.username}>{`@${mention.displayValue}`}</span>
        <span className={styles.fullName}>{mention.description}</span>
      </SecondaryButton>
    </li>
  );

  const renderMentionSuggestions = () => (
    <ul className={mentionsStyles['ql-mention-list-container']} style={props.mentionSuggestionContainerStyles}>
      {props.mentionSuggestions.map(renderMentionSuggestion)}
      {props.mentionSuggestions.size === 0 && !props.isCurrentUserOrganizationGuest
        ? renderMentionInviteButton()
        : null}
    </ul>
  );

  const renderMentionSuggestion = (mention, index) => {
    if (mention.type === MentionType.USER) {
      return renderUserMentionSuggestion(mention, index);
    } else {
      return renderGlobalMentionSuggestion(mention, index);
    }
  };

  const renderMentionInviteButton = () => (
    <>
      <li key={'invite-info'} className={styles.inviteUserListHeader}>
        {i18n.t('Invite new user by typing email')}
      </li>
      <li key={'invite'} className={styles.inviteUserListItemAction} onClick={props.onInviteUser}>
        <span className={styles.searchValue}>{props.searchPhrase}</span>
        <div className={styles.inviteButton} style={{ color: props.color }}>
          {i18n.t('INVITE')}
        </div>
      </li>
    </>
  );

  const renderEmojiSuggestions = () => {
    const { bottom } = props.mentionSuggestionContainerStyles;

    return (
      <div className={styles.emojiSuggestion} style={{ bottom }}>
        <ul className={styles.emojiSuggestionList}>{renderEmojiSuggestionsList()}</ul>
        <div className={styles.emojiSuggestionsHints}>
          <span className={styles.emojiSuggestionsHintsText}>
            <b>{'tab'}</b>
            {' or'}
          </span>
          <ArrowUp className={styles.emojiSuggestionsHintsIcon} />
          <ArrowDown className={styles.emojiSuggestionsHintsIcon} />
          <span className={styles.emojiSuggestionsHintsText}>{i18n.t('to navigate,')}</span>
          <span>
            <b>{'enter'}</b>
            {i18n.t(' to select, ')}
            <b>{'esc'}</b>
            {i18n.t(' to dismiss')}
          </span>
        </div>
      </div>
    );
  };

  function renderEmojiSuggestionsList() {
    return props.emojiSuggestions.map((emoji, index) => (
      <li
        key={emoji.colons}
        className={`
      ${styles.emojiSuggestionListItem}
      ${props.selectedEmojiIndex === index ? styles.emojiSuggestionListItemSelected : undefined}
    `}
        onMouseEnter={() => props.onSelectEmoji(index)}
        onClick={() => props.onPickEmojiFromDropdown(index)}
      >
        <Emoji className={styles.emojiSuggestionListIcon} emoji={emoji.colons} size={16} />
        <span className={styles.emojiColons}>{emoji.colons}</span>
      </li>
    ));
  }

  return (
    <UnderlinedControlledInputWrapper
      isFocused={props.isFocused}
      onSetRef={props.setReactQuillWrapperRef}
      className={props.newMessageWrapperClassName || styles.newMessage}
      tabIndex="1"
      onPasteCapture={props.onPaste}
      onBlur={props.onBlur}
    >
      {props.isMentionsTooltipOpen ? renderMentionSuggestions() : null}
      {props.isEmojiListOpen && props.emojiSuggestions.length > 0 ? renderEmojiSuggestions() : null}
      <div onClick={props.onClick}>
        <ReactQuill
          id={'newMessageEditor'}
          ref={(ref) => {
            props.setReactQuillRef(ref);
          }}
          className={
            props.className ? props.className : props.isFocused ? styles.newMessageFocused : styles.quillWrapper
          }
          onKeyPress={props.onUpdateMessageKeyPress}
          onKeyDown={props.onKeyDown}
          onFocus={props.onFocus}
          onBlur={props.onQuillBlur}
          value={props.messageContent}
          onChange={props.onUpdateMessage}
          theme={'bubble'}
          placeholder={i18n.t('Write a message…')}
          formats={quillFormats}
          modules={{
            editLastMessage: {
              onEditCurrentUserLastMessage: props.onEditCurrentUserLastMessage,
            },
            sendMessage: {
              onSendMessage: props.onSendMessage,
            },
            mentions: {
              onSetAtPosition: props.onSetAtPosition,
              onSetCursorPosition: props.onSetCursorPosition,
              onSetMentionsTooltipIsOpen: props.onSetMentionsTooltipIsOpen,
              onSetSearchPhrase: props.onSetSearchPhrase,
              onSelectPrevItem: props.onSelectPrevItem,
              onSelectNextItem: props.onSelectNextItem,
              onSelectMention: props.onSelectMention,
            },
            emojis: {
              onOpenEmojiList: props.onOpenEmojiList,
              onCloseEmojiList: props.onCloseEmojiList,
              onSelectNextItem: props.onSelectNextEmoji,
              onSelectPrevItem: props.onSelectPrevEmoji,
              onSetSearchPhrase: props.onSetEmojiSearchPhrase,
              onSetCursorPosition: props.onSetCursorPosition,
              onSetOpeningColonPosition: props.onSetOpeningColonPosition,
              onEmojiPick: props.onPickEmojiFromDropdown,
            },
            toolbar: false,
            clipboard: {
              matchers: [[Node.ELEMENT_NODE, stripStylingMatcher]],
            },
          }}
        />
      </div>
      <MessageEditorToolbar
        className={props.toolbarClassName}
        color={props.color}
        onFileUploadIconClick={props.onOpenFilePrompt}
        onGoogleDrivePick={props.onGoogleDrivePick}
        onDropboxFilesPick={props.onDropboxFilesPick}
        onInsertMentionIconClick={props.onInsertMentionToolbarIconClick}
        onEmojiToolbarIconClick={props.onEmojiToolbarIconClick}
        onEmojiPick={props.onEmojiPick}
        onGiphyPick={props.onGiphyPick}
        onFocus={props.onFocus}
      />
    </UnderlinedControlledInputWrapper>
  );
}

function stripStylingMatcher(node, delta) {
  return delta.compose(
    new Delta().retain(delta.length(), {
      header: false,
      bold: false,
      italic: false,
      font: false,
      background: false,
      color: false,
      link: false,
    }),
  );
}

export default NewMessageEditor;
