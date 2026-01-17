import { Button } from '@mui/material';
import PropTypes from 'prop-types';

import useRefreshData from 'common/hooks/useRefreshData';
import { doNothing } from 'common/utils';
import { Accordion } from 'commonComponents/Accordion/Accordion';
import AssigneesController from 'commonComponents/AssigneesController';
import ChecklistProgress from 'commonComponents/ChecklistProgress';
import DropzoneWrapper from 'commonComponents/DropzoneWrapper';
import { Points } from 'commonComponents/Icons/';
import { BarsProgress } from 'commonComponents/Icons/fontawesome/BarsProgress';
import { ChevronRight } from 'commonComponents/Icons/fontawesome/ChevronRight';
import { ListCheck } from 'commonComponents/Icons/fontawesome/ListCheck';
import { Paperclip } from 'commonComponents/Icons/fontawesome/Paperclip';
import { Xmark } from 'commonComponents/Icons/fontawesome/Xmark';
import DefaultContentSkeletonLoader from 'commonComponents/skeletons/DefaultContentSkeletonLoader';
import StopClickEventPropagation from 'commonComponents/StopClickEventPropagation/component';
import TooltipedDisabledElement from 'commonComponents/TooltipedDisabledElement';
import UniversalModal from 'commonComponents/UniversalModal';
import { PropertyButton } from 'components/buttons/PropertyButton';
import CardDetailsMessageBoard from 'components/chat/CardDetailsMessageBoard';
import FileDragBackdrop from 'components/chat/FileDragBackdrop';
import FileUploadLoaderBar from 'components/chat/FileUploadLoaderBar';
import ExtensionVisibilityWrapper from 'components/extensions/ExtensionVisibilityWrapper';
import ForbiddenPage from 'components/pages/ForbiddenPage';
import TagList from 'components/tags/TagList';
import { TagsEditPopoverButton } from 'components/tags/TagsEditPopoverButton';
import { TaskEstimates } from 'components/taskList/TaskEstimates';
import CardDetailsBreadcrumbs from 'components/tasks/CardDetailsBreadcrumbs';
import TaskCompletionStatusController from 'components/tasks/TaskCompletionStatusController';
import { useTranslation } from 'i18n';
import { ExtensionNamespace } from 'models/domain/ExtensionsModel/types';
import * as TasksActions from 'models/domain/TasksModel/actions';
import colorStyles from 'styles/colors.css';
import { getConditionalClass } from 'utils/getConditionalClass';

import { EntityType } from '../../../../common/models/domain/EntityModel/types';
import CardDetailsMoreOptions from '../CardDetailsMoreOptions';
import CardAttachmentsSection from '../cardDetailsSections/CardAttachmentsSection';
import { ButtonDownloadAllAttachments } from '../cardDetailsSections/CardAttachmentsSection/ButtonDownloadAllAttachments';
import { IndicatorTaskAttachmentsNumber } from '../cardDetailsSections/CardAttachmentsSection/IndicatorTaskAttachmentsNumer';
import CardDescriptionSection from '../cardDetailsSections/CardDescriptionSection';
import CardEstimatedEffortController from '../CardEstimatedEffortController';
import CardSpacePicker from '../CardSpacePicker';
import CardStartAndDueDateController from '../CardStartAndDueDateController';
import FollowTaskController from '../FollowTaskController';
import TaskChecklistWithAddItemButton from '../taskCheckList/TaskChecklistWithAddItemButton';
import TaskNameInput from '../taskName/TaskNameInput';
import TaskProgressEstimate from '../taskProgress/TaskProgressEstimate';
import { TimecampTimerExtension } from '../TimecampTimer';

import TaskPrioritiesPicker from '../TaskPriority/TaskPrioritiesPicker/TaskPrioritiesPicker';
import styles from './styles.css';

const refreshControllerOptions = {
  action: TasksActions.onFetchTaskDetails,
  paramsToInject: [{ key: 'taskId' }],
  isArgumentsValid: (args) => !!args.taskId,
};

CardDetailsModal.propTypes = {
  taskId: PropTypes.string,
  projectId: PropTypes.string,
  color: PropTypes.string,
  isLoading: PropTypes.bool,
  isCardDescriptionFocused: PropTypes.bool,
  isEstimatesExtensionEnabled: PropTypes.bool,
  hasAccessToEstimates: PropTypes.bool,
  isFree: PropTypes.bool,

  // from EnhanceWithFileUpload
  nameOfFileInUpload: PropTypes.string,
  isBackdropVisible: PropTypes.bool,
  onDropFile: PropTypes.func,
  onDragEnter: PropTypes.func,
  onDragLeave: PropTypes.func,
  setTaskDetailsRef: PropTypes.func,
  onSetOpenCallback: PropTypes.func,
  onOpenFilePrompt: PropTypes.func,
  onPaste: PropTypes.func,
  onTaskStatusBlur: PropTypes.func,
  onSetIsCardDescriptionFocused: PropTypes.func,
};

CardDetailsModal.defaultProps = {
  color: colorStyles.dodgerBlueColor,
  isLoading: false,
  isCardDescriptionFocused: false,
  isEstimatesExtensionEnabled: false,
  hasAccessToEstimates: true,
  isFree: false,

  // from EnhanceWithFileUpload
  nameOfFileInUpload: '',
  isBackdropVisible: false,
  onDropFile: doNothing,
  onDragEnter: doNothing,
  onDragLeave: doNothing,
  setTaskDetailsRef: doNothing,
  onSetOpenCallback: doNothing,
  onOpenFilePrompt: doNothing,
  onPaste: doNothing,
  onTaskStatusBlur: doNothing,
  onSetIsCardDescriptionFocused: doNothing,
};

function CardDetailsModal(props) {
  const { t } = useTranslation();
  useRefreshData(props, refreshControllerOptions);

  return (
    <UniversalModal
      innerModalDialogClassName={styles.innerModalDialogClassName}
      isModalOpen={props.isModalOpen}
      shouldRenderHeader={false}
      shouldRenderFooter={false}
      shouldRenderCloseIcon={false}
      onSetIsModalOpen={props.onSetIsModalOpen}
      className={styles.universalModal}
      modalBodyClassName={styles.modalBody}
    >
      <div className={styles.cardDetailsWrapper} tabIndex={-1} ref={props.setTaskDetailsRef}>
        {renderContent(props, t)}
      </div>
    </UniversalModal>
  );
}

function renderContent(props, t) {
  if (!props.taskId) {
    return null;
  }

  if (props.isAccessForbidden) {
    return renderForbiddenContent(props, t);
  }

  if (props.isLoading) {
    return renderSkeleton();
  }

  if (props.hasAccessToTask) {
    return renderTaskDetailsContent(props, t);
  }

  return renderSkeleton();
}

function renderSkeleton() {
  return (
    <div className={styles.skeletonWrapper}>
      <DefaultContentSkeletonLoader />
    </div>
  );
}

function renderTaskDetailsContent(props, t) {
  return (
    <>
      {renderHeader(props, t)}
      <div className={styles.innerContent}>
        {renderLeftContent(props, t)}
        {renderRightContent(props, t)}
      </div>
      {props.nameOfFileInUpload && <FileUploadLoaderBar fileName={props.nameOfFileInUpload} />}
    </>
  );
}

function renderForbiddenContent(props, t) {
  return (
    <ForbiddenPage
      className={styles.forbiddenContent}
      buttonText={t('Go back to project')}
      returnLink={'/'}
      onButtonClick={props.onCloseTaskDetails}
    />
  );
}

function renderHeader(props, t) {
  return (
    <div className={styles.header}>
      <div className={`${styles.headerLeft} ${styles.leftWidth}`}>
        <div className={styles.listSettings}>
          <CardDetailsBreadcrumbs
            taskId={props.taskId}
            className={`${styles.listPicker} ${getConditionalClass(styles.withRightBorder, !props.canMoveToNextList)}`}
          />
          {props.canMoveToNextList && (
            <Button variant="outlined" className={styles.moveToNextSectionButton} onClick={props.onMoveTaskToNextList}>
              <ChevronRight height="100%" />
            </Button>
          )}
        </div>

        <TaskCompletionStatusController taskId={props.taskId} color={props.color} />

        {renderExtensionControllers(props, t)}

        <AssigneesController
          objectType={EntityType.TASK_DATA}
          objectId={props.taskId}
          avatarSize={24}
          personIconClass={styles.assigneeAvatar}
        />

        <TaskPrioritiesPicker taskId={props.taskId} size="xs" />
      </div>

      <div className={`${styles.headerRight} ${styles.rightWidth}`}>
        <TimecampTimerExtension taskId={props.taskId} />
        <CardStartAndDueDateController taskId={props.taskId} />
        <div className={styles.rightMenu}>
          <FollowTaskController className={styles.followTaskController} color={props.color} objectId={props.taskId} />
          <CardDetailsMoreOptions
            taskId={props.taskId}
            color={props.color}
            targetClassName={styles.moreOption}
            popperContentWrapperClassName={styles.popperContentWrapperClassName}
            popperPlacement={'bottom-end'}
          />
          <Button variant="text-reversed" onClick={props.onCloseTaskDetails}>
            <Xmark />
          </Button>
        </div>
      </div>
    </div>
  );
}

function renderExtensionControllers(props, t) {
  return (
    <>
      <ExtensionVisibilityWrapper extensionNamespace={ExtensionNamespace.AGILE} projectId={props.projectId}>
        <CardEstimatedEffortController taskId={props.taskId} renderTargetComponent={renderCardEstimates} />
      </ExtensionVisibilityWrapper>
      <TooltipedDisabledElement
        isDisabled={props.isFree}
        message={t(`To use our awesome time estimates upgrade to Premium!`)}
      >
        <TaskEstimates taskId={props.taskId} />
      </TooltipedDisabledElement>
    </>
  );

  function renderCardEstimates(targetProps) {
    return (
      <PropertyButton
        onClick={() => targetProps.onSetIsControllerOpen(!targetProps.isControllerOpen)}
        isActive={targetProps.isControllerOpen}
        hasProperty={targetProps.isTaskEstimatedEffortExists}
        icon={<Points />}
      >
        <span>
          {targetProps.taskEstimatedEffort} {targetProps.taskEstimatedEffort === 1 ? t('point') : t('points')}
        </span>
      </PropertyButton>
    );
  }
}

function renderLeftContent(props, t) {
  return (
    <div className={`${styles.left} ${styles.leftWidth}`}>
      <DropzoneWrapper
        noClick
        noKeyboard
        className={styles.dropzone}
        onSetOpenCallback={props.onSetOpenCallback}
        onDrop={props.onDropFile}
        onDragEnter={props.onDragEnter}
        onDragLeave={props.onDragLeave}
        onPaste={props.onPaste}
      >
        <div className={styles.content} tabIndex={-1}>
          <div className={styles.inlineList}>
            <TagList
              objectId={props.taskId}
              isDeletable
              tagClassName={styles.tag}
              className={styles.inlineList}
              hideTagsPopover
            />
            <TagsEditPopoverButton taskId={props.taskId} />
          </div>

          <CardSpacePicker taskId={props.taskId} targetClassName={styles.spacePicker} />

          <TaskNameInput className={styles.taskName} taskId={props.taskId} isMultiline />

          <CardDescriptionSection className={styles.descriptionSectionWrapper} taskId={props.taskId} />

          <Accordion
            expanded
            variant="reversed"
            storageId={`card-details-progress-accordion-${props.taskId}`}
            header={
              <div className={styles.accordionHead}>
                <BarsProgress />
                <p>{t('Progress')}</p>
              </div>
            }
          >
            <div onKeyDown={(e) => e.stopPropagation()}></div>
            <TaskProgressEstimate taskId={props.taskId} />
          </Accordion>

          <Accordion
            expanded
            variant="reversed"
            storageId={`card-details-check-list-accordion-${props.taskId}`}
            header={
              <div className={styles.accordionHead}>
                <ListCheck />
                <p>{t('Checklist')}</p>

                <ChecklistProgress taskId={props.taskId} shouldRenderIcon={false} renderBrackets />
              </div>
            }
          >
            <TaskChecklistWithAddItemButton taskId={props.taskId} />
          </Accordion>

          <Accordion
            expanded
            variant="reversed"
            storageId={`card-details-attachments-accordion-${props.taskId}`}
            header={
              <div className={styles.accordionHead}>
                <Paperclip />
                <p>{t('Attachments')}</p>
                <IndicatorTaskAttachmentsNumber taskId={props.taskId} />
                <StopClickEventPropagation className={styles.downloadAll}>
                  <ButtonDownloadAllAttachments taskId={props.taskId} />
                </StopClickEventPropagation>
              </div>
            }
          >
            <CardAttachmentsSection
              className={styles.descriptionSectionWrapper}
              taskId={props.taskId}
              onClick={props.onOpenFilePrompt}
            />
          </Accordion>
        </div>

        <div className={styles.footer}>
          <div className={styles.footerContent}>
            <span>{t('Drop files here to attach or ')}</span>
            <span>&nbsp;</span>
            <div className={styles.browse} onClick={props.onOpenFilePrompt}>
              {t('browse')}
            </div>
          </div>
          {props.isBackdropVisible ? <FileDragBackdrop color={props.color} /> : null}
        </div>
      </DropzoneWrapper>
    </div>
  );
}

function renderRightContent(props, t) {
  return (
    <div className={`${styles.right} ${styles.rightWidth}`}>
      <CardDetailsMessageBoard objectId={props.taskId} />
    </div>
  );
}

export default CardDetailsModal;
