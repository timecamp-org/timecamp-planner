import React from 'react'
import styles from './styles.css'
import { Link } from 'react-router-dom'
import PrimaryButton from 'components/buttons/PrimaryButton'
import { useTranslation } from 'i18n'
import { doNothing } from 'common/utils'

type ForbiddenPageInterface = {
  returnLink: string,
  buttonText: string,
  className?: string,

  onButtonClick: VoidFunction,
}

function ForbiddenPage(props: ForbiddenPageInterface): React.ReactElement {
  const { t } = useTranslation()
  return (
    <div className={props.className}>
      <div className={styles.top}>
        <div className={styles.background}>{'403'}</div>
        <div className={styles.mascot} />
      </div>
      <div className={styles.title}>{t(`Uh oh! Access forbidden `)}</div>
      <div className={styles.subTitle}>{t(`The page you are looking for doesn’t exist. You may have mistype the address or the page may have moved. `)}</div>
      <Link to={props.returnLink}>
        <PrimaryButton
          onClick={props.onButtonClick}
        >
          {props.buttonText}
        </PrimaryButton>
      </Link>
    </div>
  )
}

ForbiddenPage.defaultProps = {
  className: styles.Component,

  onButtonClick: doNothing,
}

export default ForbiddenPage
