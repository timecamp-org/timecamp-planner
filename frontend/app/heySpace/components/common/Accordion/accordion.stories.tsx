import { Accordion } from './Accordion';

export default {
  title: 'buttons/Accordion',
};

export const accordion = (props) => (
  <Accordion header="Click" {...props}>
    Content
  </Accordion>
);
export const withRightIcon = (props) => (
  <Accordion header="Click" rightIcon="+" {...props}>
    Content
  </Accordion>
);
