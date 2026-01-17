import React from 'react';
import styles from './styles.css';
import colorStyles from 'styles/colors.css';

import commonStyles from 'styles/common.css';
import { MentionType } from 'models/domain/MessagesModel/types';
import { markdownEntityTypes } from 'models/domain/MessagesModel/markdownConstants';
import prependHttp from 'common/utils/prependHttp';

import MessageMention from 'components/chat/Message/MessageMention';
import Emoji from 'commonComponents/Emoji';
import MessageInternalLink from 'components/chat/MessageInternalLink';

const defaultRenderersConfig = {
  shouldRenderMention: true,
  shouldRenderHail: true,
  paragraphShouldHaveTopMargin: false,
};

const quoteStyle = {
  opacity: 0.7,
  borderLeft: `solid 3px ${colorStyles.cloudyBlueColor}`,
  padding: `0 ${parseInt(commonStyles.gridCellSize, 10) * 2}px`,
};

const getBoundMarkdownToReactRenderers =
  (renderersConfig = {}) =>
  (self) => {
    const config = {
      ...defaultRenderersConfig,
      ...renderersConfig,
    };
    return [
      {
        type: markdownEntityTypes.LINK,
        renderFn: (node, output, state) => {
          const isInternalLink = node.target.includes(window.location.hostname);
          const { target, title, content } = node;
          const linkText = content ? output(content, state)[0] : target;
          if (isInternalLink) {
            return (
              <MessageInternalLink
                key={state.key}
                className={styles.link}
                to={target}
                shouldStopClickEventPropagation
                shouldBeDisabledWhenCardDescriptionStateIsDirty
              >
                {linkText}
              </MessageInternalLink>
            );
          } else {
            const url = prependHttp(target);

            const onClickLink = (event) => {
              event.stopPropagation();
            };

            return (
              <a key={url} className={styles.link} href={url} title={title} target={'_blank'} onClick={onClickLink}>
                {linkText}
              </a>
            );
          }
        },
      },
      {
        type: markdownEntityTypes.TEXT,
        renderFn: (node, output, state) => node.content,
      },
      {
        type: markdownEntityTypes.BLOCK_QUOTE,
        renderFn: (node, output, state) => {
          return (
            <div key={state.key} style={quoteStyle}>
              {output(node.content, state)}
            </div>
          );
        },
      },
      {
        type: markdownEntityTypes.PARAGRAPH,
        renderFn: (node, output, state) => {
          // Add newline between paragraphs by setting every but first paragraphs (state.key > 0) top margin. We need to follow this hacky way because markdown 'eats' newline characters.
          const shouldRenderTopMarginOffset = state.key > 0;
          return (
            <div
              className={styles.paragraph}
              key={state.key}
              style={{
                marginTop: `${
                  config.paragraphShouldHaveTopMargin && shouldRenderTopMarginOffset
                    ? commonStyles.messageTextLineHeight
                    : '0'
                }`,
              }}
            >
              {output(node.content, state)}
            </div>
          );
        },
      },
      {
        type: markdownEntityTypes.CODE_BLOCK,
        renderFn: (node, output, state) => {
          let codeContent = self.replaceUserIdsWithUsernamesInRenderedCode(node.content.slice(3, -3));
          codeContent = self.replaceHailsInRenderedCode(codeContent);
          // remove first newline if exists
          if (codeContent.indexOf('/n')) {
            codeContent = codeContent.replace('\n', '');
          }
          return (
            <pre key={state.key} className={styles.codeBlock}>
              {codeContent}
            </pre>
          );
        },
      },
      {
        type: markdownEntityTypes.INLINE_CODE,
        renderFn: (node, output, state) => {
          let codeContent = self.replaceUserIdsWithUsernamesInRenderedCode(node.content);
          codeContent = self.replaceHailsInRenderedCode(codeContent);
          return (
            <code key={state.key} className={styles.inlineCode}>
              {codeContent}
            </code>
          );
        },
      },
      {
        type: markdownEntityTypes.MENTION,
        renderFn: (node, output, state) =>
          config.shouldRenderMention ? (
            <MessageMention
              key={state.key}
              userId={node.userId}
              color={self.mentionColor}
              type={MentionType.USER}
              containerObjectId={config.containerObjectId}
            />
          ) : (
            <span>{`<@${node.userId}>`}</span>
          ),
      },
      {
        type: markdownEntityTypes.HAIL,
        renderFn: (node, output, state) =>
          config.shouldRenderHail ? (
            <MessageMention
              key={state.key}
              userId={null}
              color={self.mentionColor}
              type={MentionType.HAIL}
              value={node.content}
              containerObjectId={config.containerObjectId}
            />
          ) : (
            <span>{`<!${node.content}>`}</span>
          ),
      },
      {
        type: markdownEntityTypes.EMOJI,
        renderFn: (node, output, state) => (
          <span key={state.key} className={styles.emoji}>
            <Emoji colonsEmojiCode={node.colonsEmojiCode} size={24} />
          </span>
        ),
      },
      {
        type: markdownEntityTypes.EMOTICON,
        renderFn: (node, output, state) =>
          node.isValidEmoji ? (
            <span key={state.key} className={styles.emoji}>
              <Emoji colonsEmojiCode={node.colonsEmojiCode} size={24} />
            </span>
          ) : (
            <React.Fragment key={state.key}>{node.colonsEmojiCode}</React.Fragment>
          ),
      },
    ];
  };

export default getBoundMarkdownToReactRenderers;
