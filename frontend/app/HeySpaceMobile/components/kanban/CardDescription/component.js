import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'

import { TouchableOpacity, View, Text } from 'react-native'
import Description from 'Icons/Description'
import MarkdownOutput from 'commonComponents/MarkdownOutput'
import { cloudyBlueColor } from 'common/commonStyles/colors'

CardDescription.propTypes = {
  description: PropTypes.string.isRequired,
  onDescriptionPress: PropTypes.func.isRequired,
}

function CardDescription(props) {
  return (
    <View style={styles.descriptionSection}>
      <View style={styles.sectionTitle}>
        <Description style={styles.icon} color={cloudyBlueColor} />
        <Text style={styles.sectionTitleText}>{'Description'}</Text>
      </View>
      <TouchableOpacity
        style={styles.descriptionWrapper}
        onPress={props.onDescriptionPress}
      >
        <MarkdownOutput text={props.description} />
      </TouchableOpacity>
    </View>
  )
}

export default CardDescription
