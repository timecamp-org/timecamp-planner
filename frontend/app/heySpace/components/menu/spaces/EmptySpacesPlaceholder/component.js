import { i18n, useTranslation } from 'i18n';

import styles from './styles.css';

EmptySpacesPlaceholder.defaultProps = {
  subTitle: i18n.t(
    `You don't have access to any projects at the moment. Only regular users can add and search through projects.`
  ),
};

function EmptySpacesPlaceholder(props) {
  const { t } = useTranslation();

  return (
    <div className={props.className || styles.Component}>
      <div className={styles.subTitle}>{t(props.subTitle)}</div>
    </div>
  );
}
export default EmptySpacesPlaceholder;
