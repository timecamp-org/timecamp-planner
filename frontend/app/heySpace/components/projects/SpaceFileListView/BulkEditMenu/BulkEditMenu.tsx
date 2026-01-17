import { ArrowDownToLine } from 'commonComponents/Icons/fontawesome/ArrowDowToLine';
import { TrashCan } from 'commonComponents/Icons/fontawesome/TrashCan';
import { useTranslation } from 'i18n';
import { FC } from 'react';

import DropdownMenu from 'commonComponents/DropdownMenu/DropdownMenu';

interface BulkEditButtonInterface {
  onDownload?: () => void;
  onDelete?: () => void;
}

const BulkEditMenu: FC<BulkEditButtonInterface> = ({ onDownload, onDelete }) => {
  const { t } = useTranslation();

  return (
    <DropdownMenu
      label={t('Bulk edit')}
      items={[
        {
          label: (
            <>
              <ArrowDownToLine />
              {t('Download all')}
            </>
          ),
          props: {
            onClick: onDownload,
            disabled: !onDownload,
          },
        },
        {
          label: (
            <>
              <TrashCan /> {t('Delete all')}
            </>
          ),
          props: {
            onClick: onDelete,
            disabled: !onDelete,
          },
        },
      ]}
    />
  );
};

export default BulkEditMenu;
