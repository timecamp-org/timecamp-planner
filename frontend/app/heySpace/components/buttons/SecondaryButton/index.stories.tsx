import React from 'react';
import SecondaryButton from './index';
import Emoji from 'commonComponents/Emoji';
import { withKnobs, text } from '@storybook/addon-knobs';

export default { title: 'common/Secondarybutton', decorators: [withKnobs] };

export const withText = (props) => <SecondaryButton {...props}>{text('text', 'Hello Button')}</SecondaryButton>;

export const withInnerComponent = (props) => (
  <SecondaryButton {...props}>
    <Emoji colonsEmojiCode={':+1:'} />
  </SecondaryButton>
);

export const withProjectColor = (props) => (
  <SecondaryButton projectId={'project::001'} {...props}>
    {text('text', 'Hello Button')}
  </SecondaryButton>
);
