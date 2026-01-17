import React from 'react'
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native'
import styles from './styles'
import { wisteriaColor } from 'common/commonStyles/colors'
import PersonIcon from '../../person/PersonIcon'
import PersonFullName from '../../person/PersonFullName'

function Component(props) {
  const color = props.projectColor ? props.projectColor : wisteriaColor

  function renderUserRow(userId) {
    return (
      <TouchableOpacity
        key={`ProjectMembers_invite_user_${userId}`}
        style={styles.row}
        onPress={() => props.onAddUserToProject(userId)}
      >
        <PersonIcon userId={userId} />
        <PersonFullName style={styles.rowText} userId={userId} />
      </TouchableOpacity>
    )
  }


  return (
    <View style={styles.component}>
      <TextInput
        ref={props.setTextInputRef}
        style={styles.input}
        onChangeText={props.onChangeText}
        underlineColorAndroid={color}
        placeholder={'name'}
        value={props.text}
        autoFocus
      />
      <ScrollView
        onScrollBeginDrag={props.blurTextInput}
        style={styles.list}
        keyboardShouldPersistTaps={'always'}
      >
        {
          props.userIds.map(renderUserRow)
        }
      </ScrollView>
    </View>
  )
}

export default Component
