import React from 'react'
import PropTypes from 'prop-types'
import BaseComponent from 'BaseComponent'
import { doNothing } from 'common/utils'
import emojis from 'emoji-datasource-apple/emoji.json'

const categories = {
  people: {
    symbol: 'People',
    name: 'Smileys & People',
  },
  nature: {
    symbol: 'Nature',
    name: 'Animals & Nature',
  },
  food: {
    symbol: 'Foods',
    name: 'Food & Drink',
  },
  activities: {
    symbol: 'Activity',
    name: 'Activities',
  },
  places: {
    symbol: 'Places',
    name: 'Travel & Places',
  },
  objects: {
    symbol: 'Objects',
    name: 'Objects',
  },
  symbols: {
    symbol: 'Symbols',
    name: 'Symbols',
  },
  flags: {
    symbol: 'Flags',
    name: 'Flags',
  },
}

function Enhance(ComposedComponent) {
  class EnhanceEmojiPicker extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      onChooseEmoji: PropTypes.func,
    }

    static defaultProps = {
      onChooseEmoji: doNothing,
    }

    state = {
      activeCategory: categories.people.name,
      text: '',
      emojis: emojis.filter(emoji => emoji.category === categories.people.name),
    }

    render() {
      return (
        <ComposedComponent
          categories={categories}
          onSetActiveCategory={this.onSetActiveCategory}
          activeCategory={this.state.activeCategory}
          onChooseEmoji={this.onChooseEmoji}
          emojis={this.state.emojis}
          onChangeText={this.onChangeText}
        />
      )
    }

    onChooseEmoji(emojiCode) {
      this.props.onChooseEmoji(`:${emojiCode}:`)
    }

    getEmojisToRender() {
      if (this.state.text && this.state.text.length > 0) {
        return emojis
          .filter(emoji => emoji.short_name.indexOf(this.state.text) > -1)
          .sort((a, b) => a.short_name < b.short_name)
      }

      return emojis.filter(emoji => emoji.category === this.state.activeCategory)
    }

    onChangeText(text) {
      this.setState({
        text,
      })
    }

    onSetActiveCategory(categoryName) {
      this.setState({
        activeCategory: categoryName,
      })
    }

    componentDidUpdate(prevProps, prevState) {
      if (prevState.text !== this.state.text || prevState.activeCategory !== this.state.activeCategory) {
        this.setState({
          emojis: this.getEmojisToRender(),
        })
      }
    }

  }

  return (EnhanceEmojiPicker)
}

export default (Enhance)
