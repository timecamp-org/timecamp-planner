import { ChangeEvent, useState } from 'react';

import { CircleInfo } from 'commonComponents/Icons/fontawesome/CircleInfo';
import { UnderlinedInputWrapper } from 'commonComponents/UnderlinedInputWrapper/UnderlinedInputWrapper';
import UniversalModal from 'commonComponents/UniversalModal';
import UserInput from 'commonComponents/UserInput';
import { useTranslation } from 'i18n';
import { onCloseModal } from 'models/component/ModalsModel/actions';
import { selectIsModalOpen } from 'models/component/ModalsModel/selectors';
import { ModalType } from 'models/component/ModalsModel/types';
import { onSaveToken } from 'models/domain/Timecamp/actions';
import { useDispatch, useSelector } from 'react-redux';

import styles from './style.css';
import { Hint, HintHeader, Info, InfoText, InputHeader, Link, List, SubHeader } from './styled';

const SELECTOR_PROPS = { modalType: ModalType.TIMECAMP_API_KEY_MODAL };

const Modal = () => {
  const [apiKey, setApiKey] = useState('');
  const dispatch = useDispatch();
  const isModalOpen = useSelector((state) => selectIsModalOpen(state, SELECTOR_PROPS));
  const { t } = useTranslation();

  const onModalSave = () => {
    dispatch(onSaveToken(apiKey));
  };

  const onModalClose = () => {
    dispatch(onCloseModal(ModalType.TIMECAMP_API_KEY_MODAL));
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  return (
    <UniversalModal
      isModalOpen={isModalOpen}
      cancelButtonCaption={t('Cancel')}
      saveButtonCaption={t('Save')}
      header={t('INTEGRATE WITH TIMECAMP')}
      onModalSave={onModalSave}
      onCloseModal={onModalClose}
      onSetIsModalOpen={onModalClose}
      innerModalFooterClassName={styles.footer}
      modalBodyClassName={styles.modalBody}
      shouldRenderCloseIcon
    >
      <SubHeader>{t('Connect with TimeCamp to track time to your tasks directly in Planner!')}</SubHeader>

      <Hint>
        <HintHeader>{t('How to do it?')}</HintHeader>
        <List>
          <li>
            <span>{t('Open')} </span>
            {t('Account Settings in TimeCamp')}
            <Link
              href="https://app.timecamp.com/app#/settings/users/me"
              target="_blank"
              rel="noopener noreferrer"
            ></Link>
            <span> {t('(log in first if necessary).')}</span>
          </li>

          <li>{t('Scroll down to find your programming API token and copy it.')}</li>

          <li>{t('Paste it below under API key and save.')}</li>

          <li>{t('You’re ready to enjoy time-tracking in Planner!')}</li>
        </List>

        <Info>
          <CircleInfo />
          <InfoText>
            {t('Want to see projects and tasks from Planner in TimeCamp?')}

            <Link href="https://app.timecamp.com/app#/settings/users/me" target="_blank" rel="noopener noreferrer">
              {t('Enable integration with Planner in TimeCamp.')}
            </Link>
          </InfoText>
        </Info>
      </Hint>
      <InputHeader>{t('Api Key')}</InputHeader>
      <UnderlinedInputWrapper>
        <UserInput
          placeholder={t('Paste API key here')}
          type="text"
          name={t('timecamp api key')}
          autoComplete={'off'}
          shouldPreventMousetrapCapture={false}
          value={apiKey}
          onChange={onInputChange}
        />
      </UnderlinedInputWrapper>
    </UniversalModal>
  );
};

export const TimecampApiKeyModal = () => {
  const isModalOpen = useSelector((state) => selectIsModalOpen(state, SELECTOR_PROPS));

  return isModalOpen && <Modal />;
};
