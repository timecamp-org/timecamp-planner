import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import NavigationPrompt from 'react-router-navigation-prompt';
import Textarea from 'react-textarea-autosize';

import { BoldIcon, CodeIcon, ItalicIcon, StrikethroughIcon, UnderlineIcon } from 'commonComponents/quill-icons/';
import UniversalModal from 'commonComponents/UniversalModal';
import RenderedTaskDescription from 'components/tasks/RenderedTaskDescription';
import { useTranslation } from 'i18n';

import { tabTypes } from './enhancers/EnhanceCardDetailsDescriptionEditor';
import styles from './styles.css';

CardDetailsDescriptionEditor.propTypes = {
  selectedTab: PropTypes.string,
  description: PropTypes.string.isRequired,
  onChangeDescription: PropTypes.func.isRequired,
  onChangeSelectedTab: PropTypes.func.isRequired,
  onSetTextareaRef: PropTypes.func.isRequired,

  // toolbar handlers
  onBoldClick: PropTypes.func.isRequired,
  onItalicClick: PropTypes.func.isRequired,
  onUnderlineClick: PropTypes.func.isRequired,
  onStrikeClick: PropTypes.func.isRequired,
  onCodeClick: PropTypes.func.isRequired,

  // other handlers
  onCancelEdit: PropTypes.func.isRequired,
  onSaveDescription: PropTypes.func.isRequired,
  onSetDescriptionIsBeingEdited: PropTypes.func.isRequired,
  onSetIsTaskDescriptionDirty: PropTypes.func.isRequired,
};

CardDetailsDescriptionEditor.defaultProps = {
  selectedTab: tabTypes.EDIT,
};

function CardDetailsDescriptionEditor(props) {
  const { t } = useTranslation();

  return (
    <div
      className={`${props.isDescriptionBeingEdited ? styles.containerActive : styles.containerNotActive}`}
      onClick={props.onSetDescriptionIsBeingEdited}
    >
      {props.isDescriptionBeingEdited ? renderTopBar(props, t) : null}
      {props.isDescriptionBeingEdited ? renderDescriptionBeingEdited(props, t) : renderDescription(props, t)}
      {props.isDescriptionBeingEdited ? renderBottomButtons(props, t) : null}
      <NavigationPrompt
        when={(crntLocation, nextLocation) =>
          (!nextLocation || getUrlFromLocation(crntLocation) !== getUrlFromLocation(nextLocation)) && props.isDirty
        }
        renderIfNotActive={true}
      >
        {({ isActive, onConfirm, onCancel }) => (
          <UniversalModal
            isModalOpen={isActive}
            shouldRenderCloseIcon={false}
            cancelButtonCaption={t('Cancel')}
            saveButtonCaption={t('Close')}
            onModalCancel={onCancel}
            onModalSave={() => {
              onConfirm();
              props.onSetIsTaskDescriptionDirty();
              props.onCloseCardDetailsModal();
            }}
          >
            {t('Description is not saved. Close task?')}
          </UniversalModal>
        )}
      </NavigationPrompt>
    </div>
  );
}

function renderDescriptionBeingEdited(props, t) {
  return (
    <div>{props.selectedTab === tabTypes.EDIT ? renderEditableDescription(props, t) : renderDescription(props, t)}</div>
  );
}

function renderDescription(props, t) {
  return (
    <div className={styles.renderedDescription}>
      {props.description ? (
        <RenderedTaskDescription source={props.description} />
      ) : (
        <p className={styles.emptyDescriptionPlaceholder}>{t('Add description....')}</p>
      )}
    </div>
  );
}

function renderTopBar(props, t) {
  return (
    <div className={styles.topBar}>
      <div className={styles.leftButtons}>
        <div
          className={`${styles.tabSwitcher} ${props.selectedTab === tabTypes.EDIT ? styles.tabSwitcherActive : ''}`}
          onClick={() => props.onChangeSelectedTab(tabTypes.EDIT)}
        >
          {t('Edit')}
        </div>
        <div
          className={`${styles.tabSwitcher} ${props.selectedTab === tabTypes.PREVIEW ? styles.tabSwitcherActive : ''}`}
          onClick={() => props.onChangeSelectedTab(tabTypes.PREVIEW)}
        >
          {t('Preview')}
        </div>
      </div>
      {props.selectedTab === tabTypes.EDIT ? renderToolbar(props) : null}
    </div>
  );
}

function renderToolbar(props) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarSection}>
        <div className={styles.toolbarButton}>
          <BoldIcon
            width={18}
            height={18}
            onClick={props.onBoldClick}
            onMouseDown={props.preventDescriptionTextareaBlur}
          />
        </div>
        <div className={styles.toolbarButton}>
          <ItalicIcon
            width={18}
            height={18}
            onClick={props.onItalicClick}
            onMouseDown={props.preventDescriptionTextareaBlur}
          />
        </div>
        <div className={styles.toolbarButton}>
          <UnderlineIcon
            width={18}
            height={18}
            onClick={props.onUnderlineClick}
            onMouseDown={props.preventDescriptionTextareaBlur}
          />
        </div>
        <div className={styles.toolbarButton}>
          <StrikethroughIcon
            width={18}
            height={18}
            onClick={props.onStrikeClick}
            onMouseDown={props.preventDescriptionTextareaBlur}
          />
        </div>
        <div className={styles.toolbarButton}>
          <CodeIcon
            width={18}
            height={18}
            onClick={props.onCodeClick}
            onMouseDown={props.preventDescriptionTextareaBlur}
          />
        </div>
      </div>
    </div>
  );
}

function renderEditableDescription(props, t) {
  return (
    <Textarea
      inputRef={props.onSetTextareaRef}
      textareaInstanceRef={props.onSetTextareaInstanceRef}
      className={`${styles.descriptionTextarea}`}
      value={props.description}
      minRows={1}
      onKeyDown={props.onKeyDown}
      onChange={props.onChangeDescription}
      onBlur={props.onBlur}
      onFocus={props.onFocus}
      placeholder={t('Add description....')}
    />
  );
}

function renderBottomButtons(props, t) {
  return (
    <div className={styles.bottomButtons}>
      <Button variant="text" onClick={props.onCancelEdit}>
        {t('CANCEL')}
      </Button>
      <Button onClick={props.onSaveDescription}>{t('SAVE')}</Button>
    </div>
  );
}

function getUrlFromLocation(location) {
  return `${location.pathname}${location.search}`;
}

export default CardDetailsDescriptionEditor;
