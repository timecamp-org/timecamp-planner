import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image } from 'react-native';
import styles from './styles';

import Assets from 'common/commonAssets';
import PrimaryButton from 'commonComponents/PrimaryButton';
import isIOS from '../../../utils/isIOS';
import CreateSpaceModal from '../../projects/CreateSpaceModal';

FirstProjectPlaceholderView.propTypes = {
  isCreateSpaceModalOpened: PropTypes.bool,
  onNavigateToCreateSpace: PropTypes.func.isRequired,
  onCloseCreateSpaceModal: PropTypes.func.isRequired,
};

FirstProjectPlaceholderView.defaultProps = {
  isCreateSpaceModalOpened: false,
};

function FirstProjectPlaceholderView(props) {
  return (
    <View style={styles.container}>
      <Image style={styles.mascot} source={{ uri: Assets.CHARACTER_1 }} resizeMode={'contain'} />
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{`Hello there!`}</Text>
        <Text
          style={styles.subTitle}
        >{`Looks like you are not a member of any Project. Create one by clicking button below or browse existing projects.`}</Text>
        <PrimaryButton text={'Create Project'} onPress={props.onNavigateToCreateSpace} />
      </View>
      {!isIOS && (
        <CreateSpaceModal isVisible={props.isCreateSpaceModalOpened} onClose={props.onCloseCreateSpaceModal} />
      )}
    </View>
  );
}

export default FirstProjectPlaceholderView;
