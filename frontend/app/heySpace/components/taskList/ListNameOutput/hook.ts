import { useSelector } from 'common/hooks/useSelector'
import { ListNameOutputInterface } from '.'
import { selectListName } from 'models/domain/ListsModel/selectors'
import { selectTaskSearchValue } from 'models/component/SearchModel/selectors/domain'
import { ellipsizeInTheEnd } from 'common/utils'

export type ListNameOutputHookInterface = {
  listName: string,
  searchPhrase: string,
}

export default function useComponent(props: ListNameOutputInterface): ListNameOutputHookInterface {
  const listName = useSelector(state => selectListName(state, { listId: props.listId }))
  const searchPhrase = useSelector(selectTaskSearchValue)
  return {
    listName: sanitazeListName(listName, props.maxLength),
    searchPhrase,
  }
}

function sanitazeListName(listName: string, maxLength: number): string {
  let formattedListName
  if (listName.endsWith(':')) {
    formattedListName = listName.slice(0, listName.length - 1)
  } else {
    formattedListName = listName
  }

  return maxLength ? ellipsizeInTheEnd(formattedListName, maxLength) : formattedListName
}