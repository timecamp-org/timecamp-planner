import Tag from 'components/tags/Tag';

export const renderTag =
  ({ tags, onTagDetach }) =>
  (data) => {
    const { key } = data;
    const { id } = tags.get(key);

    return <Tag key={id} tagId={id} onRemoveTag={() => onTagDetach(id)} />;
  };
