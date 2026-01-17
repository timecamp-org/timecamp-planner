import { TagInterface } from 'common/models/domain/TagsModel/types';
import Tag from 'components/tags/Tag';

import styles from './styles.css';

interface SuggestedTagPropsInterface {
  tag: TagInterface;
  isSelected?: boolean;
}

export const SuggestedTag = ({ tag, isSelected = false }: SuggestedTagPropsInterface) => (
  <Tag className={isSelected ? styles.suggestedTagActive : styles.suggestedTag} tagId={tag.id} isDeletable={false} />
);
