import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import styles from './styles'

import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import UniversalModal from 'commonComponents/UniversalModal'
import X from '../../Icons/X'
import PersonIcon from '../../person/PersonIcon'
import PersonFullName from '../../person/PersonFullName'
import RadioButton from 'commonComponents/RadioButton'
import { cloudyBlueColor, whiteTwoColor } from 'common/commonStyles/colors'
import PrimaryButton from 'commonComponents/PrimaryButton'

CreateConversationModal.propTypes = {
  isVisible: PropTypes.bool,
  searchPhrase: PropTypes.string.isRequired,
  filteredUserIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
  selectedUserIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
  onClose: PropTypes.func.isRequired,
  onModalHide: PropTypes.func.isRequired,
  onChangeSearchPhrase: PropTypes.func.isRequired,
  onAddUserToSelected: PropTypes.func.isRequired,
  onRemoveUserFromSelected: PropTypes.func.isRequired,
  onPressUserListItem: PropTypes.func.isRequired,
  onBackButtonPress: PropTypes.func.isRequired,
  onGoToConversation: PropTypes.func.isRequired,
  setSearchInputRef: PropTypes.func.isRequired,
  blurSearchInput: PropTypes.func.isRequired,
}

CreateConversationModal.defaultProps = {
  isVisible: false,
}

function CreateConversationModal(props) {
  return (
    <UniversalModal
      style={styles.modal}
      isVisible={props.isVisible}
      onBackdropPress={props.onClose}
      onBackButtonPress={props.onBackButtonPress}
      backdropOpacity={1}
      backdropColor={whiteTwoColor}
      onModalHide={props.onModalHide}
    >
      <SafeAreaView style={styles.modalContent}>
        <View style={styles.top}>
          <Text style={styles.title}>{'Create or open conversation'}</Text>
          <TouchableOpacity style={styles.closeIcon} onPress={props.onClose}>
            <X color={cloudyBlueColor} />
          </TouchableOpacity>
        </View>
        <TextInput
          ref={props.setSearchInputRef}
          style={styles.searchInput}
          value={props.searchPhrase}
          onChangeText={props.onChangeSearchPhrase}
        />
        <ScrollView onScrollBeginDrag={props.blurSearchInput} keyboardShouldPersistTaps={'always'}>
          {props.filteredUserIds.map(userId => (
            <TouchableOpacity
              key={userId}
              onPress={() => props.onPressUserListItem(userId)}
            >
              <View style={styles.userListItem}>
                <PersonIcon userId={userId} />
                <PersonFullName
                  style={styles.userFullName}
                  userId={userId}
                />
                <RadioButton
                  style={styles.radioButton}
                  isSelected={props.selectedUserIds.includes(userId)}
                  onPress={() => props.onPressUserListItem(userId)}
                />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <PrimaryButton
          style={styles.submitButton}
          text={`Go to conversation with ${props.selectedUserIds.size === 1 ? 'one person' : `${props.selectedUserIds.size} people`}`}
          isDisabled={props.selectedUserIds.size === 0}
          onPress={props.onGoToConversation}
        />
      </SafeAreaView>
    </UniversalModal>
  )
}

export default CreateConversationModal
