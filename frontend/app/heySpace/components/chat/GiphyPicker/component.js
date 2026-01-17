import { doNothing } from 'common/utils';
import { useTranslation } from 'i18n';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { useState } from 'react';
import GiphySelect from 'react-giphy-select';
import 'react-giphy-select/lib/styles.css';
import styles from './styles.css';

import { Gif } from 'commonComponents/Icons/fontawesome/Gif';
import PopoverContent from 'commonComponents/PopoverContent';
import UniversalPopover from 'commonComponents/UniversalPopover';
import SecondaryButton from 'components/buttons/SecondaryButton';
import giphyAttribution from 'styles/assets/giphyAttribution.png';

const API_KEY = process.env.GIPHY_API_KEY || '';

GiphyPicker.propTypes = {
  color: PropTypes.string,
  onEntrySelect: PropTypes.func,
};

GiphyPicker.defaultProps = {
  onEntrySelect: doNothing,
};

const onStopPropagation = (e) => e.stopPropagation();

function GiphyPicker(props) {
  const [isPickerOpen, onSetIsPickerOpen] = useState(false);
  const { t } = useTranslation();

  const onEntrySelect = (entry) => {
    props.onEntrySelect(entry);
    onSetIsPickerOpen(false);
  };

  return (
    <PopoverContent
      isVisible={isPickerOpen}
      className={props.className || styles.Component}
      onClickOutside={(e) => {
        onSetIsPickerOpen(!isPickerOpen);
        e.stopPropagation();
      }}
    >
      <UniversalPopover
        isPopoverOpened={isPickerOpen}
        popperContentWrapperClassName={styles.popoverContent}
        targetComponent={renderButton()}
        popperComponent={renderPicker()}
        popperPlacement={'top'}
        shouldRenderArrow={false}
        popperModifiers={{
          offset: {
            offset: `-300, 10`,
          },
        }}
      />
    </PopoverContent>
  );

  function renderButton() {
    return (
      <SecondaryButton
        color={props.color}
        onClick={() => onSetIsPickerOpen(!isPickerOpen)}
        isActive={isPickerOpen}
        activeClassName={styles.giphyInputOpen}
        className={styles.gifButton}
      >
        <Gif />
      </SecondaryButton>
    );
  }

  function renderPicker() {
    return (
      <div className={styles.picker} onClick={onStopPropagation}>
        <GiphySelect
          onEntrySelect={onEntrySelect}
          requestKey={API_KEY}
          placeholder={t('Search GIFs')}
          renderEntry={renderEntry}
          autoFocus={true}
          theme={{
            select: styles.giphySelect,
            selectInput: styles.giphyInput,
            attribution: styles.giphyAttribution,
            list: styles.giphyList,
            listMasonry: styles.giphyListMasonry,
            listItem: styles.giphyListItem,
            listEntryImage: styles.giphyListEntryImage,
          }}
        />
        <img src={giphyAttribution} />
      </div>
    );
  }

  function renderEntry(entry, onSelect, options) {
    const entryImage = get(entry, 'images.fixed_width');
    const entryImageStill = get(entry, 'images.fixed_width_still');
    return (
      <button
        className={options.theme.listEntry}
        style={{
          width: `${entryImage.width}px`,
          height: `${entryImage.height}px`,
          backgroundImageUrl: `url(${entryImageStill.url})`,
        }}
        onClick={() => onSelect(entry)}
        role="option"
        aria-selected
      >
        <img
          className={options.theme.listEntryImage}
          src={entryImage.url}
          width={entryImage.width}
          height={entryImage.height}
          alt={entry.slug}
        />
      </button>
    );
  }
}

export default GiphyPicker;
