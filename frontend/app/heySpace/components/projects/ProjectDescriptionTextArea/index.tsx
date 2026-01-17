import React, { FocusEventHandler, useRef, KeyboardEventHandler } from 'react';

import Textarea from 'react-textarea-autosize';

import { doNothing } from 'common/utils';
import { Id } from 'common/utils/identifier';
import { i18n, i18mark } from 'i18n';

import useComponent from './hook';
import styles from './styles.css';

export type ProjectDescriptionTextAreaInterface = {
  className?: string;
  innerClassName: string;
  projectId: Id;
  placeholder: string;
  isDisabled: boolean;
  required: boolean;
  label: string;

  onChange: FocusEventHandler<HTMLTextAreaElement>;
  onKeyDown: KeyboardEventHandler<HTMLTextAreaElement>;
  onKeyUp: KeyboardEventHandler<HTMLTextAreaElement>;
  onFocus: FocusEventHandler<HTMLTextAreaElement>;
  onBlur: FocusEventHandler<HTMLTextAreaElement>;
};

const ProjectDescriptionTextArea: React.FC<ProjectDescriptionTextAreaInterface> =
  (props) => {
    const INPUT_ID = useRef<string>(Math.random().toString());

    const {
      localProjectDescription,
      onBlurLocal,
      onDescriptionUpdate,
      onFocusLocal,
    } = useComponent(props);

    const renderLabel = () => (
      <label className={styles.label} htmlFor={INPUT_ID.current}>
        {props.label}
        {props.required ? null : (
          <span className={styles.optional}>{i18n.t('(optional)')}</span>
        )}
      </label>
    );

    return (
      <div className={props.className ? props.className : styles.Component}>
        {props.label ? renderLabel() : null}
        <Textarea
          id={INPUT_ID.current}
          className={`${props.innerClassName} ${
            props.isDisabled ? styles.inputDisabled : ''
          }`}
          value={localProjectDescription}
          placeholder={i18n.t(props.placeholder)}
          onChange={onDescriptionUpdate}
          onKeyDown={props.onKeyDown}
          onKeyUp={props.onKeyUp}
          onFocus={onFocusLocal}
          onBlur={onBlurLocal}
          minRows={4}
          maxRows={4}
          disabled={props.isDisabled}
        />
      </div>
    );
  };

ProjectDescriptionTextArea.defaultProps = {
  placeholder: i18mark('Add description...'),
  isDisabled: false,
  required: true,
  onFocus: doNothing,
  onBlur: doNothing,
  onKeyDown: doNothing,
  onKeyUp: doNothing,
};

export default ProjectDescriptionTextArea;
