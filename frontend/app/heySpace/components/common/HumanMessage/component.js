import React from 'react'
import PropTypes from 'prop-types'
import Linkify from 'linkify-react'
import Dotdotdot from 'react-dotdotdot'
import { useTranslation } from 'i18n'

import { HumanMessageKind } from 'models/domain/HumanMessageModel/types'

import styles from './styles.css'

HumanMessage.propTypes = {
  className: PropTypes.string,
  model: PropTypes.shape({
    kind: PropTypes.string,
    submessages: PropTypes.object,
    text: PropTypes.string,
    links: PropTypes.array,
  }),
  maxRows: PropTypes.number,
  isColorOverrided: PropTypes.bool,
}

HumanMessage.defaultProps = {
  className: '',
  maxRows: 1,
  isColorOverrided: false,
}

function HumanMessage(props) {
  const { t } = useTranslation()
  return (
    <div className={
      `${props.className} 
      ${props.isColorOverrided ? '' : getFontColorClassName(props)}
      `}>
      {
        props.model.links.length > 0
          ? renderTextWithLinks(props.model, t)
          : (
            <Dotdotdot clamp={props.maxRows} useNativeClamp={true}>
              {t(props.model.text)}
            </Dotdotdot>
          )
      }
    </div>
  )
}

function renderTextWithLinks(model, t) {
  let key = 0
  return (
    <Linkify options={{
      format: (value, type) => {
        let result = value

        if (type === 'url') {
          result = model.links[key]
          key++
        }

        return result
      },
    }}>
      {t(model.text)}
    </Linkify>
  )
}

function getFontColorClassName(props) {
  switch (props.model.kind) {
    case HumanMessageKind.error: {
      return styles.error
    }
    case HumanMessageKind.warning: {
      return styles.warning
    }
    case HumanMessageKind.success: {
      return styles.success
    }
    default: {
      return ''
    }
  }
}

export default HumanMessage
