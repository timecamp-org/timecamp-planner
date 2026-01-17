import React, { createElement } from 'react';
import unescape from 'lodash/unescape';
import { markdownEntityTypes } from 'models/domain/MessagesModel/markdownConstants';
import { Text, StyleSheet, Linking, View } from 'react-native';
import Emoji from 'commonComponents/Emoji';
import styles from './styles';
import Mention from '../../chat/Mention';
import handleError from 'common/utils/handleError';
import { gridCellSize } from 'styles/common';
import { doNothing } from 'common/utils';
import MessageInternalLink from '../MessageInternalLink';
import { MentionType } from 'models/domain/MessagesModel/types';
import { getConfig } from 'common/services/config';

const getWebAppUrl = () => {
  const config = getConfig();
  const urlFromConfig = config.webAppUrl || process.env.FRONTEND_BASE_URL || 'http://localhost:3002';
  // Strip protocol if present, as we only need the domain for URL matching
  return urlFromConfig.replace(/^https?:\/\//, '');
};

const defaultRenderersConfig = {
  shouldRenderLinkPreview: true,
  shouldRenderMention: true,
  shouldRenderHail: true,
  onLongPressLink: doNothing,
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
          const target = unescape(node.target);
          const webAppUrl = getWebAppUrl();
          const isInternalLink = target.includes(webAppUrl);
          if (isInternalLink) {
            return <MessageInternalLink text={target} target={target} key={state.key} />;
          } else {
            return (
              <Text
                style={styles.link}
                key={state.key}
                onPress={() => {
                  try {
                    Linking.openURL(target);
                  } catch (error) {
                    handleError(error, {
                      targetUrl: target,
                    });
                  }
                }}
                onLongPress={config.onLongPressLink}
              >
                {target}
              </Text>
            );
          }
        },
      },
      {
        type: markdownEntityTypes.BLOCK_QUOTE,
        renderFn: (node, output, state) => (
          <View key={state.key} style={styles.quoteWrapper}>
            <Text style={styles.quote}>{output(node.content, state)}</Text>
          </View>
        ),
      },
      {
        type: markdownEntityTypes.PARAGRAPH,
        renderFn: (node, output, state) => {
          // Add newline between paragraphs by setting every but first paragraphs (state.key > 0) top margin. We need to follow this hacky way because markdown 'eats' newline characters.
          const shouldRenderTopMarginOffset = state.key > 0;
          return (
            <Text
              key={state.key}
              style={StyleSheet.flatten([
                styles.paragraph,
                { marginTop: shouldRenderTopMarginOffset ? 3 * gridCellSize : 0 },
              ])}
            >
              {output(node.content, state)}
            </Text>
          );
        },
      },
      {
        type: markdownEntityTypes.TEXT,
        renderFn: (node, output, parentState) => {
          // this logic is taken from https://github.com/CharlesMangwa/react-native-simple-markdown
          const state = { ...parentState };
          // Breaking words up in order to allow for text reflowing in flexbox
          let words = unescape(node.content).split(' ');
          words = words.map((word, i) => {
            i !== words.length - 1 ? (word = `${word} `) : null;
            const textStyles = [styles.text];
            state.stylesToApply ? textStyles.push(state.stylesToApply) : null;
            return createElement(
              Text,
              {
                key: i,
                style: textStyles,
              },
              word
            );
          });
          return words;
        },
      },
      {
        type: markdownEntityTypes.IMAGE,
        renderFn: (node, output, state) => {
          return <Text key={state.key}>{node.target}</Text>;
        },
      },
      {
        type: markdownEntityTypes.CODE_BLOCK,
        renderFn: (node, output, state) => {
          let codeContent = self.replaceUserIdsWithUsernamesInRenderedCode(unescape(node.content.slice(3, -3)));
          codeContent = self.replaceHailsInRenderedCode(codeContent);
          // remove doubled newlines inserted to make simple-markdown work properly
          codeContent = codeContent.replace(/\n\n/g, '\n');
          // remove first newline if exists
          if (codeContent.indexOf('/n')) {
            codeContent = codeContent.replace('\n', '');
          }
          return (
            <Text key={state.key} style={styles.codeBlock}>
              {codeContent}
            </Text>
          );
        },
      },
      {
        type: markdownEntityTypes.INLINE_CODE,
        renderFn: (node, output, state) => {
          let codeContent = self.replaceUserIdsWithUsernamesInRenderedCode(unescape(node.content));
          codeContent = self.replaceHailsInRenderedCode(codeContent);
          return (
            <Text key={state.key} style={styles.inlineCode}>
              {codeContent}
            </Text>
          );
        },
      },
      {
        type: markdownEntityTypes.MENTION,
        renderFn: (node, output, state) => (
          <Mention key={state.key} userId={node.userId} color={self.mentionColor} type={MentionType.USER} />
        ),
      },
      {
        type: markdownEntityTypes.HAIL,
        renderFn: (node, output, state) => (
          <Mention key={state.key} color={self.mentionColor} type={MentionType.HAIL} value={node.content} />
        ),
      },
      {
        type: markdownEntityTypes.EMOJI,
        renderFn: (node, output, state) => (
          <Emoji style={styles.emoji} key={state.key} emojiCode={node.colonsEmojiCode} />
        ),
      },
      {
        type: markdownEntityTypes.EMOTICON,
        renderFn: (node, output, state) =>
          node.isValidEmoji ? (
            <Emoji style={styles.emoji} key={state.key} emojiCode={node.colonsEmojiCode} />
          ) : (
            <Text style={styles.emoji} key={state.key}>
              {node.colonsEmojiCode}
            </Text>
          ),
      },
    ];
  };

export default getBoundMarkdownToReactRenderers;
