import { Button } from '@mui/material';
import PropTypes from 'prop-types';

import useElementOpen from 'common/hooks/useElementOpen';
import { doNothing } from 'common/utils';
import Checkbox from 'commonComponents/Checkbox';
import Dropdown from 'commonComponents/Dropdown';
import Emoji from 'commonComponents/Emoji';
import { Emot } from 'commonComponents/Icons';
import { CalendarDays } from 'commonComponents/Icons/fontawesome/CalendarDays';
import PopoverContent from 'commonComponents/PopoverContent';
import { UnderlinedInputWrapper } from 'commonComponents/UnderlinedInputWrapper/UnderlinedInputWrapper';
import UniversalModal from 'commonComponents/UniversalModal';
import UniversalPopover from 'commonComponents/UniversalPopover';
import UserInput from 'commonComponents/UserInput/component';
import EmojiPicker from 'components/chat/EmojiPicker';
import DateOutput from 'components/date/DateOutput';
import DatePicker from 'components/date/DatePicker';
import TimeInput from 'components/time/TimeInput';
import { useTranslation } from 'i18n';

import { dropdownKeys, statusProposals, timePeriodDisplayNames } from './helpers';
import styles from './styles.css';

UserStatusModal.propTypes = {
  className: PropTypes.string,
  isModalVisible: PropTypes.bool,
  title: PropTypes.string,
  emojiCode: PropTypes.string,
  resetAt: PropTypes.instanceOf(Date),
  shouldShowRemoveStatusButton: PropTypes.bool,
  isSaveButtonDisabled: PropTypes.bool,
  isDatePickerOpen: PropTypes.bool,

  onSetIsModalOpen: PropTypes.func,
  onSetNewStatus: PropTypes.func,
  onChangeTitle: PropTypes.func,
  onEmojiPick: PropTypes.func,
  onToggleResetAt: PropTypes.func,
  onRemoveStatus: PropTypes.func,
  onSelectDatePeriod: PropTypes.func,
  onSelectDate: PropTypes.func,
  onCloseDatePicker: PropTypes.func,
  onResetForm: PropTypes.func,
  onKeyDown: PropTypes.func,
  onChangeTime: PropTypes.func,
};

UserStatusModal.defaultProps = {
  className: '',
  isModalVisible: false,
  title: '',
  emojiCode: null,
  resetAt: null,
  shouldShowRemoveStatusButton: false,
  isSaveButtonDisabled: false,
  isDatePickerOpen: false,

  onSetIsModalOpen: doNothing,
  onSetNewStatus: doNothing,
  onChangeTitle: doNothing,
  onEmojiPick: doNothing,
  onToggleResetAt: doNothing,
  onRemoveStatus: doNothing,
  onSelectDatePeriod: doNothing,
  onSelectDate: doNothing,
  onCloseDatePicker: doNothing,
  onResetForm: doNothing,
  onKeyDown: doNothing,
  onChangeTime: doNothing,
};

function UserStatusModal(props) {
  const { t } = useTranslation();

  return (
    <UniversalModal
      innerModalDialogClassName={styles.modalDialog}
      modalBodyClassName={styles.modalBody}
      isModalOpen={props.isModalVisible}
      header={t('Set your status')}
      onSetIsModalOpen={props.onSetIsModalOpen}
      shouldRenderFooter={false}
    >
      {renderModalContent(props, t)}
    </UniversalModal>
  );
}

function renderModalContent(props, t) {
  return (
    <div className={styles.modalContent}>
      {renderInputRow(props, t)}
      {renderStatusProposals(props, t)}
      {renderResetAtController(props, t)}
      {renderFooter(props, t)}
    </div>
  );
}

function renderInputRow(props, t) {
  return (
    <UnderlinedInputWrapper>
      <UserInput
        className={styles.inputRow}
        innerClassName={styles.inner}
        value={props.title}
        onChange={props.onChangeTitle}
        onKeyDown={props.onKeyDown}
        placeholder={t('What are you thinking?')}
      >
        {renderEmojiPicker(props)}
      </UserInput>
    </UnderlinedInputWrapper>
  );
}

function renderEmojiPicker(props) {
  return <EmojiPicker onEmojiPick={props.onEmojiPick} buttonRenderer={renderEmojiButton} />;

  function renderEmojiButton() {
    return (
      <div className={styles.emojiButton}>
        {props.emojiCode ? (
          <Emoji colonsEmojiCode={props.emojiCode} size={25} />
        ) : (
          <Emot className={styles.inputIcon} />
        )}
      </div>
    );
  }
}

function renderStatusProposals(props, t) {
  return <div className={styles.statusProposals}>{statusProposals.map(renderStatusProposal)}</div>;

  function renderStatusProposal({ title, resetPeriod, emojiCode }) {
    const periodName = t(timePeriodDisplayNames[resetPeriod]);
    const translatedTitle = t(title);

    return (
      <div
        key={title}
        className={styles.proposal}
        onClick={() => props.onClickProposal(translatedTitle, resetPeriod, emojiCode)}
      >
        <span className={styles.proposalTitle}>{translatedTitle}</span>
        <span className={styles.proposalPeriod}>{`- ${periodName}`}</span>
        <Emoji colonsEmojiCode={emojiCode} size={19} />
      </div>
    );
  }
}

function renderFooter(props, t) {
  return (
    <div className={styles.footer}>
      {props.shouldShowRemoveStatusButton && (
        <Button variant="text" onClick={props.onRemoveStatus}>
          {t('Remove status')}
        </Button>
      )}
      <Button
        variant="contained"
        disabled={props.isSaveButtonDisabled}
        onClick={props.onSetNewStatus}
        className={styles.setStatusButton}
      >
        {t('Set status')}
      </Button>
    </div>
  );
}

function renderResetAtController(props, t) {
  return (
    <div className={styles.resetAtController}>
      <div className={styles.checkboxWrapper}>
        <Checkbox
          className={styles.checkbox}
          isChecked={Boolean(props.resetAt)}
          onToggleStatus={props.onToggleResetAt}
        />
        {t('Clear status after:')}
      </div>
      {renderDatePickerPopover(props, t)}
      {renderTimeInputController(props)}
    </div>
  );
}

function renderTimeInputController(props) {
  return (
    <UnderlinedInputWrapper>
      <TimeInput value={props.resetAt} onChange={props.onChangeTime} className={styles.timeInput} />
    </UnderlinedInputWrapper>
  );
}

function renderDatePickerPopover(props, t) {
  return (
    <UniversalPopover
      isPopoverOpened={props.isDatePickerOpen}
      targetComponent={renderDatesDropdown(props, t)}
      popperComponent={renderDatePicker(props)}
      popperPlacement={'bottom-end'}
      popperModifiers={{
        offset: {
          offset: `0, 10`,
        },
      }}
    />
  );
}

function renderDatePicker(props) {
  return (
    <PopoverContent onClickOutside={props.onCloseDatePicker} isVisible={props.isDatePickerOpen}>
      <DatePicker date={props.resetAt} onChange={props.onSelectDate} />
    </PopoverContent>
  );
}

function renderDatesDropdown(props, t) {
  const {
    isOpen: isDropdownOpen,
    onClose: onCloseDropdown,
    onToggleOpen: onToggleDropdownOpen,
  } = useElementOpen(false);

  return (
    <Dropdown
      items={dropdownKeys}
      onSelectItem={props.onSelectDatePeriod}
      buttonRenderer={renderDateDropdownButton}
      dropdownItemRenderer={renderDateDropdownItem}
      onClickButtonDispatched={onToggleDropdownOpen}
      onClickOutsideDispatched={onCloseDropdown}
    />
  );

  function renderDateDropdownButton() {
    return (
      <Button variant="underlined">
        {props.resetAt ? <DateOutput timestamp={props.resetAt} className={styles.dateOutput} /> : t('select duration')}
        <CalendarDays className={styles.durationIcon} />
      </Button>
    );
  }

  function renderDateDropdownItem(period) {
    return <span>{t(timePeriodDisplayNames[period])}</span>;
  }
}

export default UserStatusModal;
