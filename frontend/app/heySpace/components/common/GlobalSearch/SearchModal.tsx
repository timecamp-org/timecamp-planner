import { ChangeEvent, FC, useEffect, useState } from 'react';

import { Divider } from '@mui/material';
import classNames from 'classnames';
import { Virtuoso } from 'react-virtuoso';

import { useSelector } from 'common/hooks/useSelector';
import Checkbox from 'commonComponents/Checkbox';
import ListContentSkeletonLoader from 'commonComponents/ListContentSkeletonLoader';
import { UnderlinedInputWrapper } from 'commonComponents/UnderlinedInputWrapper/UnderlinedInputWrapper';
import UniversalModal from 'commonComponents/UniversalModal';
import UserInput from 'commonComponents/UserInput';
import { useLoadingSkeleton } from 'hooks/useLoadingSkeleton';
import { useTranslation } from 'i18n';
import { isEmpty } from 'lodash';
import { onCloseModal } from 'models/component/ModalsModel/actions';
import { selectIsModalOpen } from 'models/component/ModalsModel/selectors';
import { ModalType } from 'models/component/ModalsModel/types';
import { useDispatch } from 'react-redux';

import { Footer } from './components/Footer';
import { ModalTabs } from './components/ModalTabs';
import { NoResults } from './components/NoResults';
import { SearchResultItem } from './components/SearchItems/SearchResultItem';
import { useModalTabs } from './hooks/useModalTabs';
import { useUserInputGlobalSearch } from './hooks/useUserInputGlobalSearch';
import styles from './styles.css';

export const SearchModal: FC<{ isOpen: boolean; onClose?: () => void }> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [searchInArchived, setSearchingArchived] = useState(false);
  const { currentTab, onTabChange } = useModalTabs();
  const { search, result } = useUserInputGlobalSearch();
  const { allData, isFetching, fetchNextPage } = result;

  useEffect(() => {
    if (searchValue.length > 2) {
      search({ searchValue, resourceType: currentTab, searchInArchived });
    }
  }, [searchValue, currentTab, searchInArchived]);

  const showLoadingScreen = useLoadingSkeleton(isFetching);

  const onSearchValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const onSearchArchivedClick = () => setSearchingArchived(!searchInArchived);

  return (
    <UniversalModal
      className={styles.universalModal}
      headerClassName={styles.modalHeader}
      innerModalDialogClassName={styles.innerModalDialogClassName}
      modalBodyClassName={styles.modalBody}
      isModalOpen={isOpen}
      shouldRenderCloseIcon={false}
      shouldRenderFooter={false}
      onSetIsModalOpen={onClose}
    >
      <UnderlinedInputWrapper className={styles.inputWrapper}>
        <UserInput
          className={styles.input}
          placeholder={t('What are you looking for?')}
          type="text"
          name={t('Search person, project or task')}
          autoComplete={'off'}
          shouldPreventMousetrapCapture={false}
          value={searchValue}
          onChange={onSearchValueChange}
          shouldFocusOnMount
        />
      </UnderlinedInputWrapper>
      <ModalTabs currentTab={currentTab} onChange={onTabChange} />
      <Divider variant="fullWidth" />
      <div className={styles.searchOptions}>
        <span className={styles.textSemibold}>{t('RESULTS')}</span>
        <div className={styles.options}>
          <label onClick={onSearchArchivedClick} className={styles.option}>
            <Checkbox isChecked={searchInArchived} />
            {t('Include archived elements')}
          </label>
          <div>
            {t('Sort by:')} <span className={styles.searchBy}>{t('Date')}</span>
          </div>
        </div>
      </div>
      <Divider variant="fullWidth" />
      <div className={classNames(styles.resultsContainer, { [styles.loading]: showLoadingScreen })}>
        {showLoadingScreen && <ListContentSkeletonLoader animationSpeed={100} />}
        {allData.length > 0 && (
          <Virtuoso
            style={{ height: '100%', display: isFetching ? 'none' : 'block' }}
            data={allData}
            itemContent={(_, item) => <SearchResultItem {...item} />}
            endReached={fetchNextPage}
          />
        )}
        {!showLoadingScreen && isEmpty(allData) && (
          <NoResults resource={currentTab} hasQuery={searchValue.length > 2} />
        )}
      </div>
      <Footer />
    </UniversalModal>
  );
};

const modalType = ModalType.GLOBAL_SEARCH_MODAL;

export default function GlobalSearchModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => selectIsModalOpen(state, { modalType }));

  const onClose = () => dispatch(onCloseModal(ModalType.GLOBAL_SEARCH_MODAL));

  return isOpen && <SearchModal isOpen={isOpen} onClose={onClose} />;
}
