import { useRef, useState, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import UserInput from 'commonComponents/UserInput';
import styles from './styles.css';
import { useTranslation } from 'i18n';
import debounce from 'lodash/debounce';
import { Search, X } from 'commonComponents/Icons';
import * as searchActions from '../../../../common/models/component/SearchModel/actions';
import SecondaryButton from 'components/buttons/SecondaryButton';

const DEBOUNCE_TIME_MS = 300;

const FilesFilter = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const innerRef = useRef<HTMLInputElement>();
  const outerRef = useRef<HTMLDivElement>();

  const setValue = (value) => dispatch(searchActions.searchFiles(value));

  const handleChange = useMemo(() => debounce((e) => setValue(e.target.value), DEBOUNCE_TIME_MS), []);

  const [isFocused, setIsFocused] = useState(false);

  const onSetIsFocused = (focused: boolean) => {
    setIsFocused(focused);
    focused ? innerRef.current?.focus() : innerRef.current?.blur();
  };

  const onHandleClose = () => {
    if (!innerRef.current) {
      return;
    }
    innerRef.current.value = '';
    setValue('');
    onSetIsFocused(false);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (innerRef.current?.value || outerRef.current?.contains(e.target as Node)) return;

      onSetIsFocused(false);
    };

    setValue('');

    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    };
  }, []);

  return isFocused ? (
    <div
      ref={outerRef}
      className={`${styles.fileSearch} ${isFocused ? styles.focused : ''}`}
      onMouseDown={() => {
        innerRef.current?.focus();
      }}
    >
      <UserInput
        className={styles.searchNameInput}
        innerClassName={styles.fileSearchInput}
        onSetInnerRef={(ref) => (innerRef.current = ref)}
        onKeyDown={null}
        onChange={handleChange}
        onFocus={() => onSetIsFocused(true)}
        placeholder={isFocused ? t('Type file name...') : ''}
      />
      <X className={styles.cancelIcon} onClick={onHandleClose} />
    </div>
  ) : (
    <div>
      <SecondaryButton className={styles.link} onClick={() => setTimeout(() => onSetIsFocused(true), 0)}>
        <Search />
      </SecondaryButton>
    </div>
  );
};

export default FilesFilter;
