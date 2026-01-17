import React from 'react'
import PropTypes from 'prop-types'
import ImmutalblePropTypes from 'immutable-prop-types'
import styles from './styles.css'
import { List } from 'immutable'

import ExtensionItem from 'components/extensions/ExtensionItem'

ExtensionList.propTypes = {
  className: PropTypes.string,
  extensionIds: ImmutalblePropTypes.list,
}

ExtensionList.defaultProps = {
  extensionIds: new List(),
}

function ExtensionList(props) {
  return (
    <div className={props.className || styles.Component}>
      {props.extensionIds.map(renderExtensionItem)}
    </div>
  )
}

function renderExtensionItem(extensionId) {
  return (
    <ExtensionItem key={extensionId} extensionId={extensionId}/>
  )
}

export default ExtensionList
