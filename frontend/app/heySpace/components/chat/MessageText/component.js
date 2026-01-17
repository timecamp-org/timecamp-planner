import React, { Fragment, useCallback } from 'react';

import { Emoji } from 'emoji-mart';
import Linkify from 'linkify-react';
import isNil from 'lodash/isNil';
import trimEnd from 'lodash/trimEnd';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import getLinkDescriptors from 'common/utils/getLinkDescriptors';
import { Exclamation } from 'commonComponents/Icons';
import LinkPreview from 'commonComponents/LinkPreview';
import PrimaryButton from 'components/buttons/PrimaryButton';
import MessageEditedInfo from 'components/chat/Message/MessageEditedInfo';
import MessageMention from 'components/chat/Message/MessageMention';
import { i18n } from 'i18n';

import styles from './styles.css';

MessageText.propTypes = {
  messageId: PropTypes.string.isRequired,

  maxMessageTextHeight: PropTypes.string.isRequired,
  isMessageTextTooLong: PropTypes.bool.isRequired,
  isTextFolded: PropTypes.bool.isRequired,
  isMessageHovered: PropTypes.bool,
  hasError: PropTypes.bool,
  shouldRenderLinkPreview: PropTypes.bool,
  text: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.string.isRequired,
  ]),
  markdownOutput: PropTypes.array,
  setMessageTextRef: PropTypes.func,
  onClickMessageExpanderButton: PropTypes.func,
};

MessageText.defaultProps = {
  text: '',
  isMessageHovered: false,
  hasError: false,
  shouldRenderLinkPreview: true,
  setMessageTextRef: doNothing,
  onClickMessageExpanderButton: doNothing,
};

const collapsedStyle = {};

function MessageText(props) {
  if (props.hasError) {
    return renderError();
  }

  return (
    <div
      ref={props.setMessageTextRef}
      className={styles.messageText}
      style={getStyles(props)}
    >
      {props.markdownOutput
        ? renderWithSimpleMarkdown(props)
        : props.text && props.text.ops
        ? renderOldQuillMessageContent(props)
        : props.text}

      {props.isMessageTextTooLong && renderLongMessageWrapper(props)}
    </div>
  );
}

const getStyles = (props) =>
  props.isTextFolded
    ? {
        maxHeight: props.maxMessageTextHeight,
      }
    : collapsedStyle;

const renderWithSimpleMarkdown = (props) => {
  const renderLinkPreview = useCallback(
    (descriptor) => (
      <LinkPreview
        key={`preview_${descriptor.url}`}
        linkTitle={descriptor.title}
        url={descriptor.url}
        target={'_blank'}
        messageId={props.messageId}
      />
    ),
    [props.messageId]
  );
  const filteredOutput = props.markdownOutput.filter(
    (element) => !isNil(element) && typeof element !== 'string'
  ); // filter out trailing newlines etc
  return filteredOutput.map((element, index) => {
    const linkDescriptors = getLinkDescriptors(element);
    const isLastElement = index === filteredOutput.length - 1;
    const shouldRenderIsEdited = props.isEdited && isLastElement;
    const key = isLastElement ? `message-${props.messageId}` : element.key;
    return (
      <React.Fragment key={key}>
        {element}
        {shouldRenderIsEdited && (
          <MessageEditedInfo isEdited={props.isEdited} />
        )}
        {props.shouldRenderLinkPreview &&
          linkDescriptors.map(renderLinkPreview)}
      </React.Fragment>
    );
  });
};

const renderOldQuillMessageContent = (props) =>
  props.text.ops.map((operation, index) => {
    if (operation.hasOwnProperty('insert')) {
      if (typeof operation.insert === 'string') {
        // Cut off return character after last insert to place "edited" text instead
        const operationItem = { ...operation };
        const isLastOperation = index === props.text.ops.length - 1;
        if (isLastOperation) {
          operationItem.insert = trimEnd(operation.insert);
        }
        const shouldRenderIsEdited = props.isEdited && isLastOperation;
        return (
          <Linkify
            key={index}
            options={{ attributes: { style: { color: props.color } } }}
          >
            {renderTextWithStyles(operationItem, shouldRenderIsEdited)}
          </Linkify>
        );
      } else if (operation.insert.mention) {
        const mentionData = operation.insert.mention;
        return (
          <MessageMention
            key={index}
            userId={mentionData.userId}
            color={props.color}
            type={mentionData.type}
            value={mentionData.value}
          />
        );
      } else if (operation.insert.emoji) {
        const { colons } = operation.insert.emoji;
        return (
          <span key={index} className={styles.emoji}>
            <Emoji emoji={colons} size={24} />
          </span>
        );
      } else {
        // TODO handle other types of components like links etc
        return null;
      }
    }

    return null;
  });

function renderTextWithStyles(
  { insert, attributes = {} },
  shouldRenderIsEdited
) {
  let renderedElement = insert;
  if (attributes.hasOwnProperty('bold') && attributes.bold) {
    renderedElement = <strong>{renderedElement}</strong>;
  }

  if (attributes.hasOwnProperty('italic') && attributes.italic) {
    renderedElement = <em>{renderedElement}</em>;
  }

  if (attributes.hasOwnProperty('underline') && attributes.italic) {
    renderedElement = (
      <span style={{ textDecoration: 'underline' }}>{renderedElement}</span>
    );
  }

  if (attributes.hasOwnProperty('background') && attributes.background) {
    renderedElement = (
      <span style={{ background: `${attributes.background}` }}>
        {renderedElement}
      </span>
    );
  }

  if (attributes.hasOwnProperty('link') && attributes.link) {
    const link =
      attributes.link.indexOf('http') >= 0
        ? attributes.link
        : `http://${attributes.link}`;
    renderedElement = (
      <a href={link} target="_blank">
        {renderedElement}
      </a>
    );
  }

  return (
    <Fragment>
      {renderedElement}
      {shouldRenderIsEdited && <MessageEditedInfo />}
    </Fragment>
  );
}

const renderLongMessageWrapper = (props) => (
  <div
    className={`${
      props.isMessageHovered
        ? styles.messageExpandHovered
        : styles.messageExpand
    } ${!props.isTextFolded ? styles.messageExpandTextExpanded : ''}`}
  >
    <PrimaryButton
      color={props.color}
      className={styles.expanderButton}
      onClick={props.onClickMessageExpanderButton}
    >
      {`${
        props.isTextFolded ? i18n.t('Show more...') : i18n.t('Show less...')
      }`}
    </PrimaryButton>
  </div>
);

const renderError = () => (
  <span className={styles.error}>
    <Exclamation className={styles.errorIcon} />
    {i18n.t(`Something went wrong and message cannot be displayed.`)}
  </span>
);

export default MessageText;
