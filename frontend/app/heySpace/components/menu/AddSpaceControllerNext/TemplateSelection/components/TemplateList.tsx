import { FC, ReactNode } from 'react';

import { ProjectTemplateInterface } from '../../types';
import { List } from '../styled';

import { sortBy } from 'lodash';
import { SelectTemplateButton } from './TemplateListItem';

interface TemplateListInterface {
  header?: ReactNode;
  templates: ProjectTemplateInterface[];
  selectedTemplateId: string;
  onTemplateSelect: (id: string) => void;
}

export const TemplateList: FC<TemplateListInterface> = ({
  header,
  templates = [],
  selectedTemplateId,
  onTemplateSelect,
}) => (
  <>
    {header}
    <List>
      {sortBy(templates, ['order', 'name'], ['asc', 'asc']).map((template) => (
        <SelectTemplateButton
          key={template.id}
          isActive={selectedTemplateId === template.id}
          template={template}
          onClick={onTemplateSelect}
        />
      ))}
    </List>
  </>
);
