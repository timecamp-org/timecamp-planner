import React from 'react'
import PropTypes from 'prop-types'
import { fromJS } from 'immutable'
import { blackColor, lightGreyColor, wisteriaColor } from 'common/commonStyles/colors'

import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native'

import TabNavigation from 'commonComponents/TabNavigation'
import ToolbarBoldIcon from 'Icons/ToolbarBoldIcon'
import ToolbarItalicIcon from 'Icons/ToolbarItalicIcon'
import ToolbarUnderlineIcon from 'Icons/ToolbarUnderlineIcon'
import ToolbarStrikeIcon from 'Icons/ToolbarStrikeIcon'
import ToolbarCodeIcon from 'Icons/ToolbarCodeIcon'
import MarkdownOutput from 'commonComponents/MarkdownOutput'
import BottomDescriptionEditorButtons from '../BottomDescriptionEditorButtons'
import isIOS from '../../../utils/isIOS'
import { tabTypes } from './enhancers/EnhanceCardDescriptionEditor'
import styles from './styles'

const isAndroid = !isIOS

const tabItems = fromJS([
  {
    key: tabTypes.EDIT,
    text: 'Edit',
  },
  {
    key: tabTypes.PREVIEW,
    text: 'Preview',
  },
])

CardDescriptionEditor.propTypes = {
  selectedTab: PropTypes.string,
  description: PropTypes.string.isRequired,
  selection: PropTypes.shape({
    start: PropTypes.number,
    end: PropTypes.number,
  }),
  taskColor: PropTypes.string,

  onChangeTab: PropTypes.func.isRequired,
  onChangeDescription: PropTypes.func.isRequired,
  onChangeSelection: PropTypes.func.isRequired,
  onSaveDescription: PropTypes.func.isRequired,
  onCancelEditingDescription: PropTypes.func.isRequired,

  // toolbar
  onPressBold: PropTypes.func.isRequired,
  onPressItalic: PropTypes.func.isRequired,
  onPressUnderline: PropTypes.func.isRequired,
  onPressStrike: PropTypes.func.isRequired,
  onPressCode: PropTypes.func.isRequired,
}

CardDescriptionEditor.defaultProps = {
  selectedTab: tabTypes.PREVIEW,
  taskColor: wisteriaColor,
}

function CardDescriptionEditor(props) {
  return (
    <View style={styles.container}>

      <View style={isIOS ? styles.tabNavigationIOS : styles.tabNavigationAndroid}>
        <TabNavigation
          tabItems={tabItems}
          activeColor={props.taskColor}
          selectedTab={props.selectedTab}
          wrapperBackgroundColorIOS={lightGreyColor}
          onChangeTab={props.onChangeTab}
        />
      </View>

      {props.selectedTab === tabTypes.EDIT
        ? renderToolbar(props)
        : null
      }

      {renderDescription(props)}

      <BottomDescriptionEditorButtons
        onCancelEditingDescription={props.onCancelEditingDescription}
        onSaveDescription={props.onSaveDescription}
      />

    </View>
  )
}

function renderToolbar(props) {
  return (
    <View style={styles.toolbar}>
      <View style={styles.toolbarSection}>

        <TouchableOpacity onPress={props.onPressBold}>
          <ToolbarBoldIcon color={blackColor} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={props.onPressItalic}>
          <ToolbarItalicIcon color={blackColor} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={props.onPressUnderline}>
          <ToolbarUnderlineIcon color={blackColor} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={props.onPressStrike}>
          <ToolbarStrikeIcon color={blackColor} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={props.onPressCode}>
          <ToolbarCodeIcon color={blackColor} style={styles.icon} />
        </TouchableOpacity>

      </View>
    </View>
  )
}

function renderDescription(props) {
  switch (props.selectedTab) {
    case tabTypes.PREVIEW: {
      return (
        <ScrollView style={styles.description}>
          <MarkdownOutput text={props.description} />
        </ScrollView>
      )
    }

    case tabTypes.EDIT:
    default: {
      return (
        <View style={styles.description}>
          <TextInput
            style={styles.descriptionEditor}
            value={props.description}
            selection={isAndroid ? props.selection : undefined}
            multiline
            onChangeText={props.onChangeDescription}
            onSelectionChange={props.onChangeSelection}
          />
        </View>
      )
    }
  }
}

export default CardDescriptionEditor
