import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, Image } from 'react-native'
import UniversalModal from 'commonComponents/UniversalModal'

import PrimaryButton from 'commonComponents/PrimaryButton'
import Assets from 'common/commonAssets'

import styles from './styles'

CurrentOrganizationController.propTypes = {
  ownerEmail: PropTypes.string,
  currentOrganizationName: PropTypes.string,

  isOrganizationArchived: PropTypes.bool.isRequired,
}

CurrentOrganizationController.defaultTypes = {
  ownerEmail: '',
  currentOrganizationName: '',

  isOrganizationArchived: false,
}

function CurrentOrganizationController(props) {

  if (!props.isOrganizationArchived) {
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
          {`Workspace ${props.currentOrganizationName} has been archived!`}
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

export default CurrentOrganizationController
