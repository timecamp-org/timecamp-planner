import { FC } from 'react';

import { Box, Button, SxProps } from '@mui/material';
import { Editor } from '@tiptap/react';
import classNames from 'classnames';

import { ArrowRotateRight } from 'commonComponents/Icons/fontawesome/ArrowRotateRight';
import { ArrowRotateLeft } from 'commonComponents/Icons/fontawesome/ArrrowRotateLeft';
import { Bold } from 'commonComponents/Icons/fontawesome/Bold';
import { BracketsCurly } from 'commonComponents/Icons/fontawesome/Brackets';
import { Code } from 'commonComponents/Icons/fontawesome/Code';
import { Eraser } from 'commonComponents/Icons/fontawesome/Eraser';
import { Italic } from 'commonComponents/Icons/fontawesome/Italic';
import { List } from 'commonComponents/Icons/fontawesome/List';
import { ListOl } from 'commonComponents/Icons/fontawesome/ListOL';
import { Strikethrough } from 'commonComponents/Icons/fontawesome/StrikeTrough';
import { Underline } from 'commonComponents/Icons/fontawesome/Underline';

import styles from './styles.css';

const boxStyles: SxProps = {
  position: 'sticky',
  top: 0,
  zIndex: 1,
  backgroundColor: 'var(--color-white)',
  paddingBottom: '.2rem',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '.5rem',
  justifyContent: 'flex-end',
  marginBottom: '1rem',
  marginLeft: 'auto',
  paddingTop: '0.2rem',
};

interface MenuBarInterface {
  editor?: Editor;
}

export const MenuBar: FC<MenuBarInterface> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <Box sx={boxStyles}>
      <Button
        variant="text-reversed"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={classNames({ [styles.isActive]: editor.isActive('bold') })}
      >
        <Bold />
      </Button>
      <Button
        variant="text-reversed"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={classNames({ [styles.isActive]: editor.isActive('italic') })}
      >
        <Italic />
      </Button>
      <Button
        variant="text-reversed"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={classNames({ [styles.isActive]: editor.isActive('strike') })}
      >
        <Strikethrough />
      </Button>

      <Button
        variant="text-reversed"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={classNames({ [styles.isActive]: editor.isActive('underline') })}
      >
        <Underline />
      </Button>

      <Button
        variant="text-reversed"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={classNames({ [styles.isActive]: editor.isActive('bulletList') })}
      >
        <List />
      </Button>
      <Button
        variant="text-reversed"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={classNames({ [styles.isActive]: editor.isActive('orderedList') })}
      >
        <ListOl />
      </Button>

      <Button
        variant="text-reversed"
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={classNames({ [styles.isActive]: editor.isActive('code') })}
      >
        <Code />
      </Button>

      <Button
        variant="text-reversed"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={classNames({ [styles.isActive]: editor.isActive('codeBlock') })}
      >
        <BracketsCurly />
      </Button>

      <Button
        variant="text-reversed"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <ArrowRotateLeft />
      </Button>
      <Button
        variant="text-reversed"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <ArrowRotateRight />
      </Button>

      <Button variant="text-reversed" onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        <Eraser />
      </Button>
    </Box>
  );
};
