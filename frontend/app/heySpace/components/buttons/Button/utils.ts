import { ButtonInterface } from 'components/buttons/Button/index'
import { ButtonKind } from 'components/buttons/Button/types'
import styles from './styles.css'

export function getButtonClassName(props: ButtonInterface): string {
  const classNames = [props.className]
  classNames.push(getButtonKindClassName(props.kind))
  classNames.push(getButtonActiveClassName(props.isActive, props.kind))
  classNames.push(getButtonDisabledClassName(props.isDisabled))

  return classNames
    .filter(Boolean)
    .join(' ')
}

export function getButtonActiveClassName(isActive: boolean, kind: ButtonKind): string {
  if (isActive) {
    return styles[`${kind}--active`]
  } else {
    return ''
  }
}

export function getButtonKindClassName(kind: ButtonKind): string {
  switch (kind) {
    case ButtonKind.DEFAULT: return styles.default
    case ButtonKind.DANGER: return styles.danger
    default: return styles.default
  }
}

export function getButtonDisabledClassName(isDisabled: boolean): string {
  if (isDisabled) {
    return styles.disabled
  } else {
    return ''
  }
}