import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'

import { View, Text, Image, StyleSheet } from 'react-native'

const leftSideAvatarStyle = { width: '100%', height: '100%' }

export default class GroupConversationIcon extends React.Component {

  static propTypes = {
    size: PropTypes.number,
    firstUser: PropTypes.shape({
      id: PropTypes.string.isRequired,
      initials: PropTypes.string,
      avatarUrl: PropTypes.string,
    }),
    secondUser: PropTypes.shape({
      id: PropTypes.string.isRequired,
      initials: PropTypes.string,
      avatarUrl: PropTypes.string,
    }),
    thirdUser: PropTypes.shape({
      id: PropTypes.string.isRequired,
      initials: PropTypes.string,
      avatarUrl: PropTypes.string,
    }),
  }

  static defaultProps = {
    size: 35,
  }

  renderIcon(user, isLeftSide) {
    return user.avatarUrl ? this.renderAvatar(user.avatarUrl, isLeftSide) : this.renderInitials(user.initials, isLeftSide)
  }

  renderAvatar(avatarUrl, isLeftSide) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        style={isLeftSide
          ? leftSideAvatarStyle
          : { width: this.props.size / 2, height: this.props.size / 2 }
        }
        resizeMode={'cover'}
      />
    )
  }

  renderInitials(initials) {
    return (
      <View style={styles.initialsAvatar}>
        <Text style={styles.initials}>{initials}</Text>
      </View>
    )
  }

  renderRightAvatarsWithThirdUser() {
    return (
      <React.Fragment>
        <View style={styles.rightAvatar}>
          {this.renderIcon(this.props.secondUser)}
        </View>
        <View style={styles.divider} />
        <View style={styles.rightAvatar}>
          {this.renderIcon(this.props.thirdUser)}
        </View>
      </React.Fragment>
    )
  }

  renderRightAvatar() {
    return this.renderIcon(this.props.secondUser)
  }

  render() {
    const {
      firstUser,
      secondUser,
      thirdUser,
    } = this.props

    if (!firstUser || !secondUser) {
      return null
    }

    return (
      <View style={StyleSheet.flatten([styles.container, this.getContainerStyleSheet()])}>

        <View style={styles.left}>
          {this.renderIcon(firstUser, true)}
        </View>

        <View style={styles.right}>
          {thirdUser
            ? this.renderRightAvatarsWithThirdUser()
            : this.renderRightAvatar()
          }
        </View>

      </View>
    )
  }

  getContainerStyleSheet() {
    const { size } = this.props
    return {
      width: size,
      height: size,
      borderRadius: (size / 2),
    }
  }

}
