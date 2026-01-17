import React from 'react';
import { Quill } from 'react-quill';
import styles from './styles.css';
const Embed = Quill.import('blots/embed');

import { Emoji } from 'emoji-mart';

class EmojiBlot extends Embed {
  static create(data) {
    const node = super.create();

    const { colons } = data;
    const id = colons.slice(1, -1);

    node.innerHTML = Emoji({
      html: true,
      size: 16,
      emoji: colons,
      fallback: () => <span>{colons}</span>,
    });
    node.dataset.id = id;
    node.dataset.colons = colons;

    return node;
  }

  static value(domNode) {
    return {
      id: domNode.dataset.id,
      colons: domNode.dataset.colons,
    };
  }
}

EmojiBlot.blotName = 'emoji';
EmojiBlot.tagName = 'span';
EmojiBlot.className = styles.emoji;

Quill.register(EmojiBlot);
