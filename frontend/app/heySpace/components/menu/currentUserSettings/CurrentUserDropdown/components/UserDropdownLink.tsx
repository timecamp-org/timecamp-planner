import { Link, LinkProps } from 'react-router-dom';

import styles from '../styles.css';

const externalLinkProps: Partial<LinkProps> = {
  target: '_blank',
  rel: 'noopener noreferrer',
};

interface UserDropdownLinkInterface {
  url: string;
}
// @ts-ignore
const UserDropdownLink: ReactFCWithChildren<UserDropdownLinkInterface> = ({ children, url }) => {
  if (!url) {
    return children;
  }

  const isExternalLink = url.includes('https');

  return (
    <Link
      to={{
        pathname: url,
      }}
      {...(isExternalLink ? externalLinkProps : {})}
      className={styles.anchor}
    >
      {children}
    </Link>
  );
};

export default UserDropdownLink;
