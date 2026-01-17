import { FC } from 'react';

import { get } from 'lodash';
import { useQuery } from 'react-query';

import { useTranslation } from 'common/i18n';
import { HeySpaceClient } from 'common/services';
import { Id } from 'common/utils/identifier';
import ListContentSkeletonLoader from 'commonComponents/ListContentSkeletonLoader';
import UniversalModal from 'commonComponents/UniversalModal';

import { Message } from './Message';
import styles from './styles.css';

interface ChatPreviewInterface {
  messageId: Id;
  onClosePreview: VoidFunction;
}

export const ChatPreview: FC<ChatPreviewInterface> = ({ messageId, onClosePreview }) => {
  const { t } = useTranslation();
  const { data, isFetching } = useQuery({
    queryKey: ['search-messages', messageId],
    queryFn: () => HeySpaceClient.restApiClient.searchNeighbouringMessages(messageId),
    keepPreviousData: true,
  });

  return (
    <UniversalModal
      modalBodyClassName={styles.modalBody}
      isModalOpen={true}
      shouldRenderCloseIcon
      shouldRenderFooter={false}
      onSetIsModalOpen={onClosePreview}
      header={t('Chat preview')}
    >
      <div>
        {isFetching && <ListContentSkeletonLoader animationSpeed={100} />}

        {data?.map(({ content, createdAt, editedAt, senderId, id }, index) => (
          <Message
            key={id}
            content={content}
            isContinuation={get(data, index - 1)?.senderId === senderId}
            senderId={senderId}
            timestamp={editedAt || createdAt}
          />
        ))}
      </div>
    </UniversalModal>
  );
};
