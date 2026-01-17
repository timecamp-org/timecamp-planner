import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import nodeEmoji from 'node-emoji';

Emoji.propTypes = {
  emojiCode: PropTypes.string.isRequired,
  ...Text.propTypes,
};

export default function Emoji(props) {
  const { emojiCode, ...otherProps } = props;
  const emoji = nodeEmoji.get(emojiCode);

  return <Text {...otherProps}>{emoji}</Text>;
}
