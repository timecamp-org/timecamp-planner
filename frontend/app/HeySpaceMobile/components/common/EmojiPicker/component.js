import React, { memo } from 'react'
import { View, TouchableOpacity, FlatList, TextInput } from 'react-native'
import PropTypes from 'prop-types'
import styles, { emojiSize, categoryIconColor, activeCategoryIconColor, numberOfEmojiColumns } from './styles'
import * as icons from '../../Icons/emojiMart'
import AppleEmoji from '../../common/AppleEmoji'
import { doNothing } from 'common/utils'

EmojiPicker.propTypes = {
  categories: PropTypes.shape(),
  emojis: PropTypes.arrayOf(
    PropTypes.shape({
      short_name: PropTypes.string,
      sheet_y: PropTypes.number,
      sheet_x: PropTypes.number,
    }),
  ),
  activeCategory: PropTypes.string,
  onChooseEmoji: PropTypes.func,
  onSetActiveCategory: PropTypes.func,
  onChangeText: PropTypes.func,
}

EmojiPicker.defaultProps = {
  categories: {},
  emojis: [],
  onChooseEmoji: doNothing,
  onSetActiveCategory: doNothing,
  onChangeText: doNothing,
}

function EmojiPicker(props) {
  return (
    <View style={styles.emojiPicker} >
      <View style={styles.categories}>
        {Object.keys(props.categories).map(renderCategory)}
      </View>
      <TextInput
        onChangeText={props.onChangeText}
        style={styles.input}
        placeholder={'Search'}
      />
      <FlatList
        data={props.emojis}
        renderItem={({ item }) => renderEmoji(item)}
        numColumns={numberOfEmojiColumns}
        contentContainerStyle={styles.emojis}
        keyExtractor={item => item.short_name}
      />
    </View>
  )

  function renderEmoji(emoji) {
    return (
      <TouchableOpacity
        onPress={() => props.onChooseEmoji(emoji.short_name)}
        style={styles.emojiButton}
        key={emoji.short_name}
      >
        <AppleEmoji
          emojiSize={emojiSize}
          sheetY={emoji.sheet_y}
          sheetX={emoji.sheet_x}
        />
      </TouchableOpacity>
    )
  }

  function renderCategory(item) {
    const category = props.categories[item]
    return (
      <TouchableOpacity
        key={category.name}
        onPress={() => props.onSetActiveCategory(category.name)}
        style={styles.categoryButton}
      >
        {icons[category.symbol]({
          color: props.activeCategory === category.name
            ? activeCategoryIconColor
            : categoryIconColor
        })}
      </TouchableOpacity>
    )
  }
}

export default memo(EmojiPicker)
