import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'

import {
  selectCustomFieldValue,
} from 'models/domain/ExtensionsModel/selectors/domain'

import { TargetType, FieldType, ExtensionNamespace } from 'models/domain/ExtensionsModel/types'

function Enhance(ComposedComponent) {
  class EnhanceTaskEstimateEffort extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      taskId: PropTypes.string.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          taskEstimateEffort={this.props.taskEstimateEffort}
          styles={this.props.styles}
          alwaysVisible={this.props.alwaysVisible}
        />
      )
    }

  }

  function mapStateToProps(state, props) {
    return {
      taskEstimateEffort: selectCustomFieldValue(state, {
        extensionNamespace: ExtensionNamespace.AGILE,
        fieldType: FieldType.ESTIMATED_EFFORT,
        targetId: props.taskId,
        targetType: TargetType.TASK,
      }),
    }
  }

  return connect(mapStateToProps)(EnhanceTaskEstimateEffort)
}

export default Enhance
