import get from 'lodash/get'
import uniqBy from 'lodash/uniqBy'
import values from 'lodash/values'
import { ReactElement, ReactNode } from 'react';
import { deepForEach } from 'react-children-utilities';
import { isUrl } from 'models/domain/MessagesModel/utils';
import { Dict } from 'common/types';

export type LinkDescriptor = {
  url: string,
  title?: string,
}

export default function getLinkDescriptors(element: ReactElement): LinkDescriptor[] {
  const descriptors: Dict<LinkDescriptor> = {}
  const children: ReactNode | ReactNode[] = get(element, 'props.children')

  if (!children) {
    return []
  }

  const anchors = findAnchors(children)
  anchors.forEach(anchor => {
    if (typeof anchor === 'string') {
      descriptors[anchor] = {
        url: anchor,
        title: anchor,
      }
    } else {
      const url = get(anchor, 'props.href')
      descriptors[url] = {
        url,
        title: get(anchor, 'props.title'),
      }
    }
  })

  return values(descriptors)
}

function findAnchors(children: ReactNode | ReactNode[]): ReactElement[] {
  let anchors: ReactElement[] = []
  deepForEach(children, (child: ReactElement) => {
    const subChildren: ReactNode | ReactNode[] = get(child, 'props.children')
    if (subChildren) {
      anchors = [...anchors, ...findAnchors(subChildren)]
    }

    if (child.type === 'a' || (typeof child === 'string' && isUrl(child))) {
      anchors.push(child)
    }
  })
  return uniqBy(anchors, 'key')
}
