import React from 'react'
import styles from './styles.css'
import { i18n, i18mark } from 'i18n'

EmptyTaskListPlaceholder.defaultProps = {
  title: i18mark('Hmm… nothing matches your search.'),
  subTitle: i18mark(`We’ve searched everything but still no result. Maybe a little spelling mistake?`),
}

function EmptyTaskListPlaceholder(props) {
  return (
    <div className={props.className || styles.Component}>
      <div className={props.mascotClassName ? props.mascotClassName : styles.mascot}/>
      <div className={styles.title}>{i18n.t(props.title)}</div>
      <div className={styles.subTitle}>{i18n.t(props.subTitle)}</div>
    </div>
  )
}


export default EmptyTaskListPlaceholder
