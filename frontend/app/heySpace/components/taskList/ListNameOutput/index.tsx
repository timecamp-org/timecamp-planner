import React, {
  MouseEventHandler, LegacyRef, FC, RefObject
} from 'react'
import { doNothing } from 'common/utils'
import Highlighter from 'react-highlight-words'
import styles from './styles.css'
import useComponent from './hook'


export type ListNameOutputInterface = {
  listId: string,
  className?: string,
  placeholder?: string,
  maxLength?: number,
  shouldHighlightSearchPhrase?: boolean,
  searchPhrase?: string,

  onClick?: MouseEventHandler<HTMLSpanElement>,
  targetRef?: RefObject<HTMLSpanElement>,
  onSetRef?: LegacyRef<HTMLSpanElement>,
}

const defaultProps: Partial<ListNameOutputInterface> = {
  shouldHighlightSearchPhrase: false,
  searchPhrase: '',
  onClick: doNothing,
  onSetRef: doNothing,
}

const ListNameOutput: FC<ListNameOutputInterface> = (props) => {
  const hook = useComponent(props)
  return (
    <span
      className={props.className || styles.Component}
      ref={props.targetRef || props.onSetRef}
      onClick={props.onClick}
    >
      {hook.listName === ''
        ? <span className={styles.placeholder}>
          {props.placeholder}
        </span>
        : props.shouldHighlightSearchPhrase && props.searchPhrase
          ? <Highlighter
            searchWords={[props.searchPhrase]}
            autoEscape
            textToHighlight={hook.listName}
          />
          : hook.listName
      }
    </span>
  )
}

ListNameOutput.defaultProps = defaultProps

export default ListNameOutput
