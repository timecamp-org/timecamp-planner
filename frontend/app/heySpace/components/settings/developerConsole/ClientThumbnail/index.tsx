import React from 'react';
import { doNothing } from 'common/utils';
import ProgressiveImage from 'react-progressive-image';
import useInitials from 'common/hooks/useInitials';
import styles from './styles.css';

export interface ClientThumbnailInterface {
  className: string;
  clientName: string;
  clientThumbnailUrl: string;
  onClick: CallableFunction;
}

const ClientThumbnail: React.FC<ClientThumbnailInterface> = ({
  className = '',
  clientName = '',
  onClick = doNothing,
  clientThumbnailUrl,
}) => {
  const initials = useInitials(clientName);
  return (
    <div className={className || styles.Component}>
      {clientThumbnailUrl ? renderClientThumbnail(clientThumbnailUrl, initials) : renderInitials(initials)}
    </div>
  );
};

function renderClientThumbnail(clientThumbnailUrl: string, initials: string) {
  return (
    //@ts-ignore
    <ProgressiveImage src={clientThumbnailUrl} placeholder={initials}>
      {(src: string, loading: boolean) => renderImage(loading, src)}
    </ProgressiveImage>
  );
}

function renderImage(loading: boolean, src: string) {
  return loading ? <div className={styles.imagePlaceholder}></div> : <img src={src} className={styles.image} />;
}

function renderInitials(initials: string) {
  return <div className={styles.initials}>{initials}</div>;
}

export default ClientThumbnail;
