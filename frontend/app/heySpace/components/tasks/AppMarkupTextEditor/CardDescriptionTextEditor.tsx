/* eslint-disable no-shadow */
import { FC, useRef, useState } from 'react';

import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import classNames from 'classnames';
import { Markdown } from 'tiptap-markdown';

import useOnClickOutside from 'hooks/useOnClickOutside';

import { parseAppMarkupToMarkdown, parseMarkdownToAppMarkup } from './markdownParsers';
import { MenuBar } from './MenuBar';
import styles from './styles.css';

interface AppMarkupTextEditorInterface {
  text: string;
  placeholder?: string;
  onDescriptionChange?: (appMarkup: string) => void;
  onBlur?: (appMarkup: string) => void;
  className?: string;
  activeClassName?: string;
}

export const AppMarkupTextEditor: FC<AppMarkupTextEditorInterface> = ({
  text,
  onDescriptionChange,
  onBlur,
  activeClassName,
  className,
  placeholder,
}) => {
  const editorWrapper = useRef(null);
  const [isActive, setIsActive] = useState(false);

  const onHideMenu = () => setIsActive(false);
  const onShowMenu = () => setIsActive(true);

  useOnClickOutside(editorWrapper, onHideMenu);

  const editor = useEditor({
    // eslint-disable-next-line no-sparse-arrays
    extensions: [
      Markdown.configure({ linkify: true, breaks: true }),
      StarterKit,
      Link.configure({
        openOnClick: true,
      }),
      Underline,
      ,
      Placeholder.configure({ emptyEditorClass: styles.placeholder, placeholder }),
    ],
    content: parseAppMarkupToMarkdown(text),
    onUpdate: ({ editor }) => {
      const appMarkup = parseMarkdownToAppMarkup(editor?.storage?.markdown?.getMarkdown()) ?? '';

      onDescriptionChange?.(appMarkup);
    },
    onBlur: ({ editor }) => {
      const appMarkup = parseMarkdownToAppMarkup(editor?.storage?.markdown?.getMarkdown()) ?? '';
      onBlur?.(appMarkup);
    },
  });

  return (
    <div
      ref={editorWrapper}
      onFocus={onShowMenu}
      className={classNames(className, styles.ProseMirror, { [activeClassName]: isActive })}
    >
      {isActive && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
};
