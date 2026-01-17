import React from 'react'
import PropTypes from 'prop-types'
import Textarea from 'react-textarea-autosize'
import styles from './styles.css'

import { doNothing } from '../../../../../common/utils'
import UniversalModal from '../../../common/UniversalModal'
import FeedbackCheckboxWithAdditionalInput from 'commonComponents/FeedbackCheckboxWithAdditionalInput'

FinalDeleteAccountConfirmationModal.propTypes = {
  // modal props
  isModalOpen: PropTypes.bool,
  header: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  saveButtonCaption: PropTypes.string.isRequired,
  cancelButtonCaption: PropTypes.string.isRequired,
  additionalFeedbackLabel: PropTypes.string.isRequired,
  feedbackPoints: PropTypes.array.isRequired,

  // rest props
  additionalFeedback: PropTypes.string,
  onSetIsModalOpened: PropTypes.func,
  onSetFeedbackPointValue: PropTypes.func,
  onSendFeedback: PropTypes.func,
  onChangeAdditionalFeedback: PropTypes.func,
}

FinalDeleteAccountConfirmationModal.defaultProps = {
  isModalOpen: false,
  additionalFeedback: '',

  onSetIsModalOpened: doNothing,
  onSetFeedbackPointValue: doNothing,
  onSendFeedback: doNothing,
  onChangeAdditionalFeedback: doNothing,
}

function FinalDeleteAccountConfirmationModal(props) {

  const renderFeedbackRow = (feedbackPoint) => (
    <FeedbackCheckboxWithAdditionalInput
      {...feedbackPoint}
      setRef={props.onSetFeedbackPointValue(feedbackPoint.key)}
    />
  )

  return (
    <UniversalModal
      isModalOpen={props.isModalOpen}
      innerModalDialogClassName={styles.modalDialog}
      header={props.header}
      saveButtonCaption={props.saveButtonCaption}
      cancelButtonCaption={props.cancelButtonCaption}
      onBackdropClick={() => props.onSetIsModalOpened(false)}
      onSetIsModalOpen={props.onSetIsModalOpened}
      onModalSave={props.onSendFeedback}
    >
      <div className={styles.confirmationDialogBody}>
        {props.subtitle
          ? props.subtitle.split('\n').map(renderSubtitlePart)
          : null
        }
        <div className={styles.survey}>
          {props.feedbackPoints.map(renderFeedbackRow)}
        </div>
        <div className={styles.text}>{props.additionalFeedbackLabel}</div>
        <Textarea
          minRows={4}
          className={styles.textarea}
          onChange={props.onChangeAdditionalFeedback}
          value={props.additionalFeedback}
        />
      </div>
    </UniversalModal>
  )
}

function renderSubtitlePart(text, index) {
  return <div key={index}>{text}</div>
}

export default FinalDeleteAccountConfirmationModal
