import React from 'react';
import PrimaryButton from './index';
import Emoji from 'commonComponents/Emoji';
import { withKnobs, text } from '@storybook/addon-knobs';

export default { title: 'common/PrimaryButton', decorators: [withKnobs] };

export const withText = (props) => <PrimaryButton {...props}>{text('text', 'Hello Button')}</PrimaryButton>;

export const withInnerComponent = (props) => (
  <PrimaryButton {...props}>
    <Emoji colonsEmojiCode={':+1:'} />
  </PrimaryButton>
);
