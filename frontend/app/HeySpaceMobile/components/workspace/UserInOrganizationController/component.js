import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, Image } from 'react-native'
import UniversalModal from 'commonComponents/UniversalModal'

import PrimaryButton from 'commonComponents/PrimaryButton'
import Assets from 'common/commonAssets'

import styles from './styles'

UserInOrganizationController.propTypes = {
  ownerEmail: PropTypes.string,
  currentOrganizationName: PropTypes.string,

  isUserRemovedFromOrganization: PropTypes.bool.isRequired,
}

UserInOrganizationController.defaultTypes = {
  ownerEmail: '',
  currentOrganizationName: '',

  isUserRemovedFromOrganization: false,
}

function UserInOrganizationController(props) {

  if (!props.isUserRemovedFromOrganization) {
    return null
  }

  return (
    <UniversalModal
      isVisible={true}
    >
      {renderContent()}
    </UniversalModal>
  )

  function renderContent() {
    return (
      <View style={styles.content}>
        <Text style={styles.header}>
          {`You have been removed from the ${props.currentOrganizationName} workspace!`}
        </Text>
        <Image
          source={{ uri: Assets.CHARACTER_31 }}
          style={styles.mascot}
          resizeMode={'contain'}
        />
        <Text style={styles.text}>
          {`In order to retrieve the access to this workspace contact ${props.ownerEmail}`}
        </Text>
        <View style={styles.buttonWrapper}>
          <PrimaryButton
            style={styles.button}
            text={`Got it!`}
            onPress={props.onRedirectFromThisWorkspace}
          />
        </View>
      </View>
    )
  }

}

export default UserInOrganizationController
