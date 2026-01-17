import React from 'react';
import Button from './index';
import { ButtonKind } from './types';

export default {
  title: 'buttons/Button',
};

export const defaultButton = (props) => <Button {...props}>Click me!</Button>;

export const dangerButton = (props) => (
  <Button kind={ButtonKind.DANGER} {...props}>
    Click me!
  </Button>
);
